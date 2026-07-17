import { query } from '../database/pool';
import { Hospital, HospitalRow, mapHospitalRow } from '../models/Hospital';
import {
  buildHospitalFilterClause,
  HospitalFilters,
} from './hospitalFilterService';

const HOSPITAL_COLUMNS =
  'id, name, latitude, longitude, occupancy, type, status, governorate';

export async function getAllHospitals(
  filters: HospitalFilters = {}
): Promise<Hospital[]> {
  const { clause, params } = buildHospitalFilterClause(filters);

  const { rows } = await query<HospitalRow>(
    `SELECT ${HOSPITAL_COLUMNS}
     FROM hospitals
     ${clause}
     ORDER BY name ASC`,
    params
  );

  return rows.map(mapHospitalRow);
}

export async function getHospitalById(id: string): Promise<Hospital | null> {
  const { rows } = await query<HospitalRow>(
    `SELECT ${HOSPITAL_COLUMNS}
     FROM hospitals
     WHERE id = $1`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapHospitalRow(rows[0]);
}

export async function updateHospitalOccupancy(
  id: string,
  occupancy: number
): Promise<Hospital | null> {
  const { rows } = await query<HospitalRow>(
    `UPDATE hospitals
     SET occupancy = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING ${HOSPITAL_COLUMNS}`,
    [id, occupancy]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapHospitalRow(rows[0]);
}

export async function getHospitalCount(): Promise<number> {
  const { rows } = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM hospitals`
  );
  return Number(rows[0]?.count ?? 0);
}

export async function getAverageOccupancy(): Promise<number> {
  const { rows } = await query<{ avg: string | null }>(
    `SELECT COALESCE(AVG(occupancy), 0)::text AS avg FROM hospitals`
  );
  return Math.round(Number(rows[0]?.avg ?? 0) * 10) / 10;
}
