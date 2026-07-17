import { getAmbulanceCount } from './ambulanceService';
import { getActiveAlertCount } from './alertService';
import { getAverageOccupancy, getHospitalCount } from './hospitalService';

export interface DashboardStats {
  totalHospitals: number;
  totalAmbulances: number;
  averageOccupancy: number;
  activeAlerts: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalHospitals, totalAmbulances, averageOccupancy, activeAlerts] =
    await Promise.all([
      getHospitalCount(),
      getAmbulanceCount(),
      getAverageOccupancy(),
      getActiveAlertCount(),
    ]);

  return {
    totalHospitals,
    totalAmbulances,
    averageOccupancy,
    activeAlerts,
  };
}
