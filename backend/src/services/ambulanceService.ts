import { query } from '../database/pool';
import { Ambulance, AmbulanceRow, mapAmbulanceRow } from '../models/Ambulance';

export async function getAllAmbulances(): Promise<Ambulance[]> {
  const { rows } = await query<AmbulanceRow>(
    `SELECT id, code, latitude, longitude, status, hospital_id
     FROM ambulances
     ORDER BY code ASC`
  );

  return rows.map(mapAmbulanceRow);
}

export async function getAmbulanceById(id: string): Promise<Ambulance | null> {
  const { rows } = await query<AmbulanceRow>(
    `SELECT id, code, latitude, longitude, status, hospital_id
     FROM ambulances
     WHERE id = $1`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapAmbulanceRow(rows[0]);
}

export async function updateAmbulancePosition(
  id: string,
  latitude: number,
  longitude: number
): Promise<Ambulance | null> {
  const { rows } = await query<AmbulanceRow>(
    `UPDATE ambulances
     SET latitude = $2, longitude = $3, updated_at = NOW()
     WHERE id = $1
     RETURNING id, code, latitude, longitude, status, hospital_id`,
    [id, latitude, longitude]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapAmbulanceRow(rows[0]);
}

export async function getAmbulanceCount(): Promise<number> {
  const { rows } = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM ambulances`
  );
  return Number(rows[0]?.count ?? 0);
}
