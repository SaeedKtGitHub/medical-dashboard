import { pool, query } from '../database/pool';
import { Alert, AlertSeverity } from '../models/Alert';
import { Ambulance } from '../models/Ambulance';
import { Hospital } from '../models/Hospital';
import {
  HistorySnapshot,
  HistorySnapshotRow,
  mapHistorySnapshotRow,
} from '../models/History';
import { getLatestAlerts } from './alertService';
import { getAllAmbulances } from './ambulanceService';
import { getAllHospitals } from './hospitalService';
import { logger } from '../utils/logger';

export interface HistoricalSystemState {
  snapshot: HistorySnapshot;
  hospitals: Hospital[];
  ambulances: Ambulance[];
  alerts: Alert[];
}

/**
 * Captures the current system state into history tables.
 */
export async function createHistorySnapshot(): Promise<HistorySnapshot> {
  const [hospitals, ambulances, alerts] = await Promise.all([
    getAllHospitals(),
    getAllAmbulances(),
    getLatestAlerts(20),
  ]);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const snapshotResult = await client.query<HistorySnapshotRow>(
      `INSERT INTO history_snapshots DEFAULT VALUES
       RETURNING id, created_at`
    );
    const snapshot = mapHistorySnapshotRow(snapshotResult.rows[0]);

    for (const hospital of hospitals) {
      await client.query(
        `INSERT INTO hospital_history (snapshot_id, hospital_id, occupancy)
         VALUES ($1, $2, $3)`,
        [snapshot.id, hospital.id, hospital.occupancy]
      );
    }

    for (const ambulance of ambulances) {
      await client.query(
        `INSERT INTO ambulance_history
           (snapshot_id, ambulance_id, latitude, longitude, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          snapshot.id,
          ambulance.id,
          ambulance.latitude,
          ambulance.longitude,
          ambulance.status,
        ]
      );
    }

    for (const alert of alerts) {
      await client.query(
        `INSERT INTO alert_history (snapshot_id, message, severity)
         VALUES ($1, $2, $3)`,
        [snapshot.id, alert.message, alert.severity]
      );
    }

    await client.query('COMMIT');
    logger.info(`History snapshot created: ${snapshot.id}`);
    return snapshot;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function listHistorySnapshots(
  limit = 120
): Promise<HistorySnapshot[]> {
  const { rows } = await query<HistorySnapshotRow>(
    `SELECT id, created_at
     FROM history_snapshots
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  return rows.map(mapHistorySnapshotRow);
}

export async function getHistorySnapshotById(
  snapshotId: string
): Promise<HistoricalSystemState | null> {
  const snapshotResult = await query<HistorySnapshotRow>(
    `SELECT id, created_at
     FROM history_snapshots
     WHERE id = $1`,
    [snapshotId]
  );

  if (snapshotResult.rows.length === 0) {
    return null;
  }

  const snapshot = mapHistorySnapshotRow(snapshotResult.rows[0]);

  const [hospitalRows, ambulanceRows, alertRows] = await Promise.all([
    query<{
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      occupancy: number;
      type: string;
      status: string;
      governorate: string;
    }>(
      `SELECT h.id, h.name, h.latitude, h.longitude, hh.occupancy,
              h.type, h.status, h.governorate
       FROM hospital_history hh
       INNER JOIN hospitals h ON h.id = hh.hospital_id
       WHERE hh.snapshot_id = $1
       ORDER BY h.name ASC`,
      [snapshotId]
    ),
    query<{
      id: string;
      code: string;
      latitude: number;
      longitude: number;
      status: string;
      hospital_id: string | null;
    }>(
      `SELECT a.id, a.code, ah.latitude, ah.longitude, ah.status, a.hospital_id
       FROM ambulance_history ah
       INNER JOIN ambulances a ON a.id = ah.ambulance_id
       WHERE ah.snapshot_id = $1
       ORDER BY a.code ASC`,
      [snapshotId]
    ),
    query<{
      message: string;
      severity: AlertSeverity;
    }>(
      `SELECT message, severity
       FROM alert_history
       WHERE snapshot_id = $1`,
      [snapshotId]
    ),
  ]);

  const hospitals: Hospital[] = hospitalRows.rows.map((row) => ({
    id: row.id,
    name: row.name,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    occupancy: Number(row.occupancy),
    type: row.type,
    status: row.status,
    governorate: row.governorate,
  }));

  const ambulances: Ambulance[] = ambulanceRows.rows.map((row) => ({
    id: row.id,
    code: row.code,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    status: row.status,
    hospitalId: row.hospital_id,
  }));

  const alerts: Alert[] = alertRows.rows.map((row, index) => ({
    id: `${snapshot.id}-alert-${index}`,
    message: row.message,
    severity: row.severity,
    category: 'System',
    createdAt: snapshot.createdAt,
    isRead: true,
  }));

  return {
    snapshot,
    hospitals,
    ambulances,
    alerts,
  };
}

export async function findNearestSnapshotId(
  targetIso: string
): Promise<string | null> {
  const target = new Date(targetIso);
  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const { rows } = await query<{ id: string }>(
    `SELECT id
     FROM history_snapshots
     ORDER BY ABS(EXTRACT(EPOCH FROM (created_at - $1::timestamptz))) ASC
     LIMIT 1`,
    [target.toISOString()]
  );

  return rows[0]?.id ?? null;
}

export class HistorySnapshotScheduler {
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;

    void this.captureSafely();

    this.timer = setInterval(() => {
      void this.captureSafely();
    }, 60_000);

    logger.info('History snapshot scheduler started (every 60s)');
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.running = false;
    logger.info('History snapshot scheduler stopped');
  }

  private async captureSafely(): Promise<void> {
    try {
      await createHistorySnapshot();
    } catch (error) {
      logger.error('Failed to create history snapshot', error);
    }
  }
}

export const historySnapshotScheduler = new HistorySnapshotScheduler();
