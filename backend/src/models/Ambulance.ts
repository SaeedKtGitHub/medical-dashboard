export type AmbulanceStatus = 'available' | 'en_route' | 'busy' | 'offline';

export interface Ambulance {
  id: string;
  code: string;
  latitude: number;
  longitude: number;
  status: string;
  hospitalId: string | null;
}

export interface AmbulanceRow {
  id: string;
  code: string;
  latitude: number;
  longitude: number;
  status: string;
  hospital_id: string | null;
}

export function mapAmbulanceRow(row: AmbulanceRow): Ambulance {
  return {
    id: row.id,
    code: row.code,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    status: row.status,
    hospitalId: row.hospital_id,
  };
}
