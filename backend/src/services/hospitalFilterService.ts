export type OccupancyFilter = 'low' | 'medium' | 'high';

export interface HospitalFilters {
  search?: string;
  governorate?: string;
  type?: string;
  status?: string;
  occupancy?: OccupancyFilter;
}

export interface SqlFilterClause {
  clause: string;
  params: unknown[];
}

/**
 * Builds a reusable SQL WHERE clause for hospital filtering.
 * Supports combining search, governorate, type, status, and occupancy band.
 */
export function buildHospitalFilterClause(
  filters: HospitalFilters = {},
  startIndex = 1
): SqlFilterClause {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let index = startIndex;

  if (filters.search?.trim()) {
    conditions.push(`name ILIKE $${index}`);
    params.push(`%${filters.search.trim()}%`);
    index += 1;
  }

  if (filters.governorate?.trim()) {
    conditions.push(`governorate ILIKE $${index}`);
    params.push(filters.governorate.trim());
    index += 1;
  }

  if (filters.type?.trim()) {
    conditions.push(`type ILIKE $${index}`);
    params.push(filters.type.trim());
    index += 1;
  }

  if (filters.status?.trim()) {
    conditions.push(`status ILIKE $${index}`);
    params.push(filters.status.trim());
    index += 1;
  }

  if (filters.occupancy) {
    const occupancyClause = getOccupancySqlClause(filters.occupancy);
    if (occupancyClause) {
      conditions.push(occupancyClause);
    }
  }

  if (conditions.length === 0) {
    return { clause: '', params: [] };
  }

  return {
    clause: `WHERE ${conditions.join(' AND ')}`,
    params,
  };
}

export function parseHospitalFilters(
  query: Record<string, unknown>
): HospitalFilters {
  const filters: HospitalFilters = {};

  const search = asOptionalString(query.search);
  const governorate = asOptionalString(query.governorate);
  const type = asOptionalString(query.type);
  const status = asOptionalString(query.status);
  const occupancy = asOptionalString(query.occupancy);

  if (search) filters.search = search;
  if (governorate) filters.governorate = governorate;
  if (type) filters.type = type;
  if (status) filters.status = status;
  if (occupancy === 'low' || occupancy === 'medium' || occupancy === 'high') {
    filters.occupancy = occupancy;
  }

  return filters;
}

function getOccupancySqlClause(occupancy: OccupancyFilter): string | null {
  switch (occupancy) {
    case 'low':
      return 'occupancy <= 40';
    case 'medium':
      return 'occupancy > 40 AND occupancy <= 80';
    case 'high':
      return 'occupancy > 80';
    default:
      return null;
  }
}

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function matchesOccupancyBand(
  occupancy: number,
  band: OccupancyFilter
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
