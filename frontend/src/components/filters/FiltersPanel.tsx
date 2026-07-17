import type { DashboardFilters, OccupancyBand } from '../../types';
import {
  FACILITY_TYPES,
  HOSPITAL_STATUSES,
  OCCUPANCY_OPTIONS,
} from '../../types';
import {
  labels,
  translateFacilityType,
  translateGovernorate,
  translateStatus,
} from '../../i18n/ar';
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
      title={labels.filters}
      action={
        <button type="button" className="btn-link" onClick={onReset}>
          {labels.reset}
        </button>
      }
    >
      <div className="filters-panel">
        <label className="filter-field">
          <span>{labels.searchHospital}</span>
          <input
            type="search"
            placeholder={labels.searchPlaceholder}
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>{labels.governorate}</span>
          <select
            value={filters.governorate}
            onChange={(event) => onChange('governorate', event.target.value)}
          >
            <option value="">{labels.allGovernorates}</option>
            {governorates.map((governorate) => (
              <option key={governorate} value={governorate}>
                {translateGovernorate(governorate)}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>{labels.facilityType}</span>
          <select
            value={filters.type}
            onChange={(event) => onChange('type', event.target.value)}
          >
            <option value="">{labels.allTypes}</option>
            {FACILITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {translateFacilityType(type)}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>{labels.status}</span>
          <select
            value={filters.status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            <option value="">{labels.allStatuses}</option>
            {HOSPITAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {translateStatus(status)}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>{labels.occupancy}</span>
          <select
            value={filters.occupancy}
            onChange={(event) =>
              onChange('occupancy', event.target.value as OccupancyBand | '')
            }
          >
            <option value="">{labels.allOccupancy}</option>
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
            <span>{labels.showHospitals}</span>
          </label>
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={filters.showAmbulances}
              onChange={(event) =>
                onChange('showAmbulances', event.target.checked)
              }
            />
            <span>{labels.showAmbulances}</span>
          </label>
        </div>
      </div>
    </Panel>
  );
}
