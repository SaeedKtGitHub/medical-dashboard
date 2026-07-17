import { useEffect } from 'react';
import type { Alert } from '../../types';
import { labels } from '../../i18n/ar';

interface CriticalToastProps {
  alert: Alert | null;
  onDismiss: () => void;
  durationMs?: number;
}

export function CriticalToast({
  alert,
  onDismiss,
  durationMs = 5000,
}: CriticalToastProps) {
  useEffect(() => {
    if (!alert) {
      return;
    }

    const timer = window.setTimeout(() => {
      onDismiss();
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [alert, durationMs, onDismiss]);

  if (!alert) {
    return null;
  }

  return (
    <div className="toast toast--critical" role="alert">
      <div className="toast__icon" aria-hidden="true">
        !
      </div>
      <div className="toast__body">
        <strong>{labels.criticalAlert}</strong>
        <p>{alert.message}</p>
      </div>
      <button
        type="button"
        className="toast__close"
        aria-label={labels.dismissNotification}
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  );
}
