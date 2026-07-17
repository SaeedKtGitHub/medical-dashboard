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

export interface Ambulance {
  id: string;
  code: string;
  latitude: number;
  longitude: number;
  status: string;
  hospitalId: string | null;
}

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertCategory = 'Hospital' | 'Ambulance' | 'Emergency' | 'System';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  createdAt: string;
  isRead: boolean;
}

export interface DashboardStats {
  totalHospitals: number;
  totalAmbulances: number;
  averageOccupancy: number;
  activeAlerts: number;
}

export interface HistorySnapshot {
  id: string;
  createdAt: string;
}

export interface HistoricalSystemState {
  snapshot: HistorySnapshot;
  hospitals: Hospital[];
  ambulances: Ambulance[];
  alerts: Alert[];
}

export interface NearestHospital {
  name: string;
  distance: number;
  occupancy: number;
}

export type OccupancyBand = 'low' | 'medium' | 'high';

export interface DashboardFilters {
  search: string;
  governorate: string;
  type: string;
  status: string;
  occupancy: OccupancyBand | '';
  showHospitals: boolean;
  showAmbulances: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const FACILITY_TYPES = [
  'Hospital',
  'Clinic',
  'Field Medical Point',
] as const;

export const HOSPITAL_STATUSES = ['Active', 'Maintenance', 'Closed'] as const;

export const OCCUPANCY_OPTIONS: Array<{ value: OccupancyBand; label: string }> = [
  { value: 'low', label: '0–40%' },
  { value: 'medium', label: '40–80%' },
  { value: 'high', label: '80–100%' },
];

export const DEFAULT_FILTERS: DashboardFilters = {
  search: '',
  governorate: '',
  type: '',
  status: '',
  occupancy: '',
  showHospitals: true,
  showAmbulances: true,
};
