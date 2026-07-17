export function getHospitalMarkerColor(occupancy: number): string {
  if (occupancy < 40) {
    return '#22c55e';
  }
  if (occupancy <= 80) {
    return '#eab308';
  }
  return '#ef4444';
}

export function formatOccupancy(occupancy: number): string {
  return `${Math.round(occupancy)}%`;
}

export function formatCoordinate(value: number): string {
  return value.toFixed(4);
}

export function formatAlertTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatStatusLabel(status: string): string {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
