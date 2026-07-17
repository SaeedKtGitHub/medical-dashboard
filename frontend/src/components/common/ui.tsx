import { labels } from '../../i18n/ar';
import type { ReactNode } from 'react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = labels.loadingGeneric,
}: LoadingStateProps) {
  return (
    <div className="state-panel state-panel--loading" role="status">
      <div className="state-panel__brand" aria-hidden="true">
        +
      </div>
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <h2>{labels.unableToLoad}</h2>
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="btn-primary" onClick={onRetry}>
          {labels.tryAgain}
        </button>
      ) : null}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {hint ? <p className="stat-card__hint">{hint}</p> : null}
    </article>
  );
}

interface PanelProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function Panel({ title, children, action }: PanelProps) {
  return (
    <section className="panel">
      <header className="panel__header">
        <h2>{title}</h2>
        {action}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}
