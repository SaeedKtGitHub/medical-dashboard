import { useMemo, useState } from 'react';
import {
  computeFilteredStats,
  filterAmbulances,
  filterHospitals,
  uniqueGovernorates,
} from '../services/filterService';
import type {
  Alert,
  Ambulance,
  DashboardFilters,
  Hospital,
} from '../types';
import { DEFAULT_FILTERS } from '../types';

export function useDashboardFilters(
  hospitals: Hospital[],
  ambulances: Ambulance[],
  alerts: Alert[]
) {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);

  const governorates = useMemo(
    () => uniqueGovernorates(hospitals),
    [hospitals]
  );

  const filteredHospitals = useMemo(
    () => filterHospitals(hospitals, filters),
    [hospitals, filters]
  );

  const filteredAmbulances = useMemo(
    () => filterAmbulances(ambulances, filters),
    [ambulances, filters]
  );

  const filteredStats = useMemo(
    () =>
      computeFilteredStats(
        filteredHospitals,
        filteredAmbulances,
        alerts.length
      ),
    [filteredHospitals, filteredAmbulances, alerts.length]
  );

  const updateFilter = <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    filters,
    governorates,
    filteredHospitals,
    filteredAmbulances,
    filteredStats,
    updateFilter,
    resetFilters,
  };
}
