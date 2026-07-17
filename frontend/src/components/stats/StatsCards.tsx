import type { DashboardStats } from '../../types';
import { formatOccupancy } from '../../services/formatters';
import { StatCard } from '../common/ui';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-grid">
      <StatCard label="Hospitals" value={stats.totalHospitals} />
      <StatCard label="Ambulances" value={stats.totalAmbulances} />
      <StatCard
        label="Average Occupancy"
        value={formatOccupancy(stats.averageOccupancy)}
      />
      <StatCard
        label="Active Alerts"
        value={stats.activeAlerts}
        hint="Last 24 hours"
      />
    </div>
  );
}
