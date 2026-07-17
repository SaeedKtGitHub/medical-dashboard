import type { DashboardStats } from '../../types';
import { formatOccupancy } from '../../services/formatters';
import { labels } from '../../i18n/ar';
import { StatCard } from '../common/ui';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-grid">
      <StatCard label={labels.hospitals} value={stats.totalHospitals} />
      <StatCard label={labels.ambulances} value={stats.totalAmbulances} />
      <StatCard
        label={labels.averageOccupancy}
        value={formatOccupancy(stats.averageOccupancy)}
      />
      <StatCard
        label={labels.activeAlerts}
        value={stats.activeAlerts}
        hint={labels.last24Hours}
      />
    </div>
  );
}
