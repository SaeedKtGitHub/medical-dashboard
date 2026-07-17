import { AlertCenter } from '../alerts/AlertCenter';
import { CriticalToast } from '../alerts/CriticalToast';
import { ErrorState, LoadingState } from '../common/ui';
import { FiltersPanel } from '../filters/FiltersPanel';
import { TimeMachinePanel } from '../history/TimeMachinePanel';
import { Sidebar } from './Sidebar';
import { DashboardMap } from '../map/DashboardMap';
import { StatsCards } from '../stats/StatsCards';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDashboardFilters } from '../../hooks/useDashboardFilters';
import { labels } from '../../i18n/ar';

export function DashboardLayout() {
  const {
    hospitals,
    ambulances,
    alerts,
    loading,
    historyLoading,
    error,
    historyError,
    socketConnected,
    criticalToast,
    mode,
    historicalAt,
    historyDate,
    historyTime,
    setHistoryDate,
    setHistoryTime,
    loadHistoricalView,
    returnToLiveMode,
    dismissCriticalToast,
    reload,
  } = useDashboardData();

  const {
    filters,
    governorates,
    filteredHospitals,
    filteredAmbulances,
    filteredStats,
    updateFilter,
    resetFilters,
  } = useDashboardFilters(hospitals, ambulances, alerts);

  if (loading) {
    return (
      <div className="app-shell app-shell--centered">
        <LoadingState message={labels.loadingDashboard} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell app-shell--centered">
        <ErrorState
          message={
            error.includes(labels.backendUnavailable) ||
            error.toLowerCase().includes('backend unavailable')
              ? labels.backendUnavailable
              : `${labels.apiFailedPrefix}${error}`
          }
          onRetry={reload}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar socketConnected={socketConnected} mode={mode}>
        <StatsCards stats={filteredStats} />
        <TimeMachinePanel
          date={historyDate}
          time={historyTime}
          mode={mode}
          historicalAt={historicalAt}
          loading={historyLoading}
          error={historyError}
          onDateChange={setHistoryDate}
          onTimeChange={setHistoryTime}
          onLoadHistorical={() => {
            void loadHistoricalView();
          }}
          onReturnLive={() => {
            void returnToLiveMode();
          }}
        />
        <FiltersPanel
          filters={filters}
          governorates={governorates}
          onChange={updateFilter}
          onReset={resetFilters}
        />
        <AlertCenter alerts={alerts} />
      </Sidebar>

      <main className="main-area">
        <header className="main-area__header">
          <div>
            <h2>{labels.networkTitle}</h2>
            <p>
              {mode === 'historical'
                ? labels.historicalSubtitle
                : labels.liveSubtitle}
            </p>
          </div>
          {mode === 'historical' ? (
            <div className="mode-banner mode-banner--historical">
              {labels.historicalMode}
            </div>
          ) : null}
        </header>
        <DashboardMap
          hospitals={filteredHospitals}
          ambulances={filteredAmbulances}
          loading={historyLoading}
          mode={mode}
        />
      </main>

      <CriticalToast alert={criticalToast} onDismiss={dismissCriticalToast} />
    </div>
  );
}
