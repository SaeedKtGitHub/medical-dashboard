export type HospitalStatus = 'Active' | 'Maintenance' | 'Closed';

export type FacilityType = 'Hospital' | 'Clinic' | 'Field Medical Point';

export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  occupancy: number;
  type: string;
  status: string;
  governorate: string;
}

export interface HospitalRow {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  occupancy: number;
  type: string;
  status: string;
  governorate: string;
}

export function mapHospitalRow(row: HospitalRow): Hospital {
  return {
    id: row.id,
    name: row.name,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    occupancy: Number(row.occupancy),
    type: row.type,
    status: row.status,
    governorate: row.governorate,
  };
}
