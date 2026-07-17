/**
 * Reusable geographic distance helpers (Haversine formula).
 * Distances are returned in kilometers.
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * Calculates the great-circle distance between two coordinates in kilometers.
 */
export function haversineDistanceKm(from: GeoPoint, to: GeoPoint): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLng = toRadians(to.longitude - from.longitude);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

export function roundDistanceKm(distanceKm: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(distanceKm * factor) / factor;
}
