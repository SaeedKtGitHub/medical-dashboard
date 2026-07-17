import { AppError } from '../utils/errors';
import { getAmbulanceById } from './ambulanceService';
import { getAllHospitals } from './hospitalService';
import { haversineDistanceKm, roundDistanceKm } from './distanceService';

export interface NearestHospitalResult {
  name: string;
  distance: number;
  occupancy: number;
}

export async function getNearestHospitalsForAmbulance(
  ambulanceId: string,
  limit = 3
): Promise<NearestHospitalResult[]> {
  const ambulance = await getAmbulanceById(ambulanceId);

  if (!ambulance) {
    throw new AppError('Ambulance not found', 404);
  }

  const hospitals = await getAllHospitals();

  return hospitals
    .map((hospital) => ({
      name: hospital.name,
      distance: roundDistanceKm(
        haversineDistanceKm(
          {
            latitude: ambulance.latitude,
            longitude: ambulance.longitude,
          },
          {
            latitude: hospital.latitude,
            longitude: hospital.longitude,
          }
        )
      ),
      occupancy: hospital.occupancy,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
