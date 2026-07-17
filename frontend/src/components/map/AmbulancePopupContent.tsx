import { useEffect, useState } from 'react';
import type { Ambulance, NearestHospital } from '../../types';
import { api } from '../../services/api';
import {
  formatCoordinate,
  formatOccupancy,
  formatStatusLabel,
} from '../../services/formatters';

interface AmbulancePopupContentProps {
  ambulance: Ambulance;
  enabled: boolean;
}

export function AmbulancePopupContent({
  ambulance,
  enabled,
}: AmbulancePopupContentProps) {
  const [nearest, setNearest] = useState<NearestHospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const loadNearest = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await api.getNearestHospitals(ambulance.id);
        if (!cancelled) {
          setNearest(results);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load nearest hospitals'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadNearest();

    return () => {
      cancelled = true;
    };
  }, [ambulance.id, enabled]);

  return (
    <div className="map-popup map-popup--ambulance">
      <strong>{ambulance.code}</strong>
      <p>Status: {formatStatusLabel(ambulance.status)}</p>
      <p>Latitude: {formatCoordinate(ambulance.latitude)}</p>
      <p>Longitude: {formatCoordinate(ambulance.longitude)}</p>

      <div className="nearest-hospitals">
        <h4>Nearest hospitals</h4>
        {loading ? <p className="muted">Calculating distances...</p> : null}
        {error ? <p className="inline-error">{error}</p> : null}
        {!loading && !error && nearest.length === 0 ? (
          <p className="muted">No hospitals found</p>
        ) : null}
        {!loading && nearest.length > 0 ? (
          <ul>
            {nearest.map((hospital) => (
              <li key={`${hospital.name}-${hospital.distance}`}>
                <strong>{hospital.name}</strong>
                <span>
                  {hospital.distance.toFixed(1)} km ·{' '}
                  {formatOccupancy(hospital.occupancy)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
