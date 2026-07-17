import { Panel } from '../common/ui';
import { labels } from '../../i18n/ar';

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
    <Panel title={labels.timeMachine}>
      <div className="time-machine">
        {mode === 'historical' ? (
          <div className="mode-banner mode-banner--historical" role="status">
            {labels.historicalMode}
            {historicalAt ? (
              <span>
                {' '}
                · {new Date(historicalAt).toLocaleString('ar-SY')}
              </span>
            ) : null}
          </div>
        ) : (
          <p className="muted">{labels.timeMachineHint}</p>
        )}

        <label className="filter-field">
          <span>{labels.date}</span>
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>{labels.time}</span>
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
            {loading ? labels.loadingGeneric : labels.loadHistorical}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onReturnLive}
            disabled={loading || mode === 'live'}
          >
            {labels.returnLive}
          </button>
        </div>
      </div>
    </Panel>
  );
}
