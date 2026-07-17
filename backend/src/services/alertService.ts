import { query } from '../database/pool';
import {
  Alert,
  AlertCategory,
  AlertRow,
  AlertSeverity,
  mapAlertRow,
} from '../models/Alert';

export async function getLatestAlerts(limit = 20): Promise<Alert[]> {
  const { rows } = await query<AlertRow>(
    `SELECT id, message, severity, category, is_read, created_at
     FROM alerts
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  return rows.map(mapAlertRow);
}

export async function createAlert(
  message: string,
  severity: AlertSeverity,
  category: AlertCategory
): Promise<Alert> {
  const { rows } = await query<AlertRow>(
    `INSERT INTO alerts (message, severity, category, is_read)
     VALUES ($1, $2, $3, FALSE)
     RETURNING id, message, severity, category, is_read, created_at`,
    [message, severity, category]
  );

  return mapAlertRow(rows[0]);
}

export async function getActiveAlertCount(): Promise<number> {
  const { rows } = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM alerts
     WHERE created_at >= NOW() - INTERVAL '24 hours'`
  );
  return Number(rows[0]?.count ?? 0);
}
