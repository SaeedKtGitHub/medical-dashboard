import type { DashboardFilters, OccupancyBand } from '../../types';
import {
  FACILITY_TYPES,
  HOSPITAL_STATUSES,
  OCCUPANCY_OPTIONS,
} from '../../types';
import { Panel } from '../common/ui';

interface FiltersPanelProps {
  filters: DashboardFilters;
  governorates: string[];
  onChange: <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) => void;
  onReset: () => void;
}

export function FiltersPanel({
  filters,
  governorates,
  onChange,
  onReset,
}: FiltersPanelProps) {
  return (
    <Panel
      title="Filters"
      action={
        <button type="button" className="btn-link" onClick={onReset}>
          Reset
        </button>
      }
    >
      <div className="filters-panel">
        <label className="filter-field">
          <span>Search hospital</span>
          <input
            type="search"
            placeholder="Search by name..."
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>Governorate</span>
          <select
            value={filters.governorate}
            onChange={(event) => onChange('governorate', event.target.value)}
          >
            <option value="">All governorates</option>
            {governorates.map((governorate) => (
              <option key={governorate} value={governorate}>
                {governorate}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>Facility type</span>
          <select
            value={filters.type}
            onChange={(event) => onChange('type', event.target.value)}
          >
            <option value="">All types</option>
            {FACILITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            <option value="">All statuses</option>
            {HOSPITAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>Occupancy</span>
          <select
            value={filters.occupancy}
            onChange={(event) =>
              onChange('occupancy', event.target.value as OccupancyBand | '')
            }
          >
            <option value="">All occupancy levels</option>
            {OCCUPANCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="filter-toggles">
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={filters.showHospitals}
              onChange={(event) => onChange('showHospitals', event.target.checked)}
            />
            <span>Show Hospitals</span>
          </label>
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={filters.showAmbulances}
              onChange={(event) =>
                onChange('showAmbulances', event.target.checked)
              }
            />
            <span>Show Ambulances</span>
          </label>
        </div>
      </div>
    </Panel>
  );
}
