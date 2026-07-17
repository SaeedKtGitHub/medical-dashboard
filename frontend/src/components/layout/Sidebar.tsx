import type { ReactNode } from 'react';
import { labels } from '../../i18n/ar';

interface SidebarProps {
  children: ReactNode;
  socketConnected: boolean;
  mode: 'live' | 'historical';
}

export function Sidebar({ children, socketConnected, mode }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-mark" aria-hidden="true">
          +
        </div>
        <div>
          <h1>{labels.appTitle}</h1>
          <p className="sidebar__subtitle">{labels.appSubtitle}</p>
        </div>
      </div>

      <div className="status-row">
        <div
          className={`connection-status ${
            socketConnected
              ? 'connection-status--connected'
              : 'connection-status--disconnected'
          }`}
        >
          <span className="connection-status__dot" />
          {socketConnected ? labels.connected : labels.disconnected}
        </div>

        <div
          className={`mode-chip ${
            mode === 'historical' ? 'mode-chip--historical' : 'mode-chip--live'
          }`}
        >
          {mode === 'historical' ? labels.historicalMode : labels.liveMode}
        </div>
      </div>

      {!socketConnected && mode === 'live' ? (
        <p className="inline-error">{labels.socketDisconnected}</p>
      ) : null}

      {children}
    </aside>
  );
}
