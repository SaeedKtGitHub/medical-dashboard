import type {
  Ambulance,
  DashboardFilters,
  DashboardStats,
  Hospital,
  OccupancyBand,
} from '../types';

function matchesOccupancyBand(
  occupancy: number,
  band: OccupancyBand
): boolean {
  switch (band) {
    case 'low':
      return occupancy <= 40;
    case 'medium':
      return occupancy > 40 && occupancy <= 80;
    case 'high':
      return occupancy > 80;
    default:
      return true;
  }
}

export function filterHospitals(
  hospitals: Hospital[],
  filters: DashboardFilters
): Hospital[] {
  if (!filters.showHospitals) {
    return [];
  }

  const search = filters.search.trim().toLowerCase();

  return hospitals.filter((hospital) => {
    if (search && !hospital.name.toLowerCase().includes(search)) {
      return false;
    }

    if (
      filters.governorate &&
      hospital.governorate.toLowerCase() !== filters.governorate.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.type &&
      hospital.type.toLowerCase() !== filters.type.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.status &&
      hospital.status.toLowerCase() !== filters.status.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.occupancy &&
      !matchesOccupancyBand(hospital.occupancy, filters.occupancy)
    ) {
      return false;
    }

    return true;
  });
}

export function filterAmbulances(
  ambulances: Ambulance[],
  filters: DashboardFilters
): Ambulance[] {
  if (!filters.showAmbulances) {
    return [];
  }

  return ambulances;
}

export function computeFilteredStats(
  hospitals: Hospital[],
  ambulances: Ambulance[],
  alertCount: number
): DashboardStats {
  const averageOccupancy =
    hospitals.length === 0
      ? 0
      : Math.round(
          (hospitals.reduce((sum, hospital) => sum + hospital.occupancy, 0) /
            hospitals.length) *
            10
        ) / 10;

  return {
    totalHospitals: hospitals.length,
    totalAmbulances: ambulances.length,
    averageOccupancy,
    activeAlerts: alertCount,
  };
}

export function uniqueGovernorates(hospitals: Hospital[]): string[] {
  return Array.from(new Set(hospitals.map((hospital) => hospital.governorate))).sort(
    (a, b) => a.localeCompare(b)
  );
}

export function buildHospitalQuery(filters: DashboardFilters): string {
  const params = new URLSearchParams();

  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.governorate) params.set('governorate', filters.governorate);
  if (filters.type) params.set('type', filters.type);
  if (filters.status) params.set('status', filters.status);
  if (filters.occupancy) params.set('occupancy', filters.occupancy);

  const query = params.toString();
  return query ? `?${query}` : '';
}
