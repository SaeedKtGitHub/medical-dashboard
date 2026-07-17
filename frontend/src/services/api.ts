import type {
  Alert,
  Ambulance,
  DashboardFilters,
  DashboardStats,
  HistoricalSystemState,
  HistorySnapshot,
  Hospital,
  NearestHospital,
} from '../types';
import { buildHospitalQuery } from './filterService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Error(
      'Backend unavailable. Please check that the API server is running.'
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as {
    success: boolean;
    data: T;
    error?: string;
  };

  if (!payload.success) {
    throw new Error(payload.error || 'Unknown API error');
  }

  return payload.data;
}

export const api = {
  getHospitals: (
    filters?: Pick<
      DashboardFilters,
      'search' | 'governorate' | 'type' | 'status' | 'occupancy'
    >
  ) => {
    if (!filters) {
      return request<Hospital[]>('/api/hospitals');
    }

    const query = buildHospitalQuery({
      search: filters.search,
      governorate: filters.governorate,
      type: filters.type,
      status: filters.status,
      occupancy: filters.occupancy,
      showHospitals: true,
      showAmbulances: true,
    });

    return request<Hospital[]>(`/api/hospitals${query}`);
  },
  getAmbulances: () => request<Ambulance[]>('/api/ambulances'),
  getAlerts: () => request<Alert[]>('/api/alerts'),
  getDashboard: () => request<DashboardStats>('/api/dashboard'),
  getHistorySnapshots: () =>
    request<HistorySnapshot[]>('/api/history/snapshots'),
  getHistoryAt: (datetimeIso: string) =>
    request<HistoricalSystemState>(
      `/api/history/at?datetime=${encodeURIComponent(datetimeIso)}`
    ),
  getHistorySnapshot: (snapshotId: string) =>
    request<HistoricalSystemState>(`/api/history/${snapshotId}`),
  getNearestHospitals: (ambulanceId: string) =>
    request<NearestHospital[]>(
      `/api/ambulances/${ambulanceId}/nearest-hospitals`
    ),
};
