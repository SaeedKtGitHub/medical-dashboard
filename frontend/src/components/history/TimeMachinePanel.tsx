import { Panel } from '../common/ui';

interface TimeMachinePanelProps {
  date: string;
  time: string;
  mode: 'live' | 'historical';
  historicalAt: string | null;
  loading: boolean;
  error: string | null;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onLoadHistorical: () => void;
  onReturnLive: () => void;
}

export function TimeMachinePanel({
  date,
  time,
  mode,
  historicalAt,
  loading,
  error,
  onDateChange,
  onTimeChange,
  onLoadHistorical,
  onReturnLive,
}: TimeMachinePanelProps) {
  return (
    <Panel title="Time Machine">
      <div className="time-machine">
        {mode === 'historical' ? (
          <div className="mode-banner mode-banner--historical" role="status">
            Historical Mode
            {historicalAt ? (
              <span>
                {' '}
                · {new Date(historicalAt).toLocaleString()}
              </span>
            ) : null}
          </div>
        ) : (
          <p className="muted">
            Select a date and time to inspect a saved system snapshot.
          </p>
        )}

        <label className="filter-field">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>Time</span>
          <input
            type="time"
            value={time}
            onChange={(event) => onTimeChange(event.target.value)}
          />
        </label>

        {error ? <p className="inline-error">{error}</p> : null}

        <div className="time-machine__actions">
          <button
            type="button"
            className="btn-primary btn-primary--compact"
            onClick={onLoadHistorical}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load historical view'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onReturnLive}
            disabled={loading || mode === 'live'}
          >
            Return to Live Mode
          </button>
        </div>
      </div>
    </Panel>
  );
}
