import type { Alert } from '../../types';
import { formatAlertTime } from '../../services/formatters';
import {
  labels,
  translateCategory,
  translateSeverity,
} from '../../i18n/ar';
import { Panel } from '../common/ui';

interface AlertCenterProps {
  alerts: Alert[];
}

function severityIcon(severity: Alert['severity']): string {
  switch (severity) {
    case 'CRITICAL':
      return '!';
    case 'WARNING':
      return '!';
    default:
      return 'i';
  }
}

export function AlertCenter({ alerts }: AlertCenterProps) {
  return (
    <Panel title={labels.alertCenter}>
      {alerts.length === 0 ? (
        <p className="empty-state">{labels.noActiveAlerts}</p>
      ) : (
        <ul className="alert-center">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`alert-center__item alert-center__item--${alert.severity.toLowerCase()} ${
                alert.isRead ? '' : 'alert-center__item--unread'
              }`}
            >
              <div
                className={`alert-center__icon alert-center__icon--${alert.severity.toLowerCase()}`}
                aria-hidden="true"
              >
                {severityIcon(alert.severity)}
              </div>
              <div className="alert-center__content">
                <div className="alert-center__meta">
                  <span
                    className={`severity-badge severity-badge--${alert.severity.toLowerCase()}`}
                  >
                    {translateSeverity(alert.severity)}
                  </span>
                  <span className="category-chip">
                    {translateCategory(alert.category)}
                  </span>
                  <time dateTime={alert.createdAt}>
                    {formatAlertTime(alert.createdAt)}
                  </time>
                </div>
                <p>{alert.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
