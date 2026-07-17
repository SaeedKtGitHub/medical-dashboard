import type { ReactNode } from 'react';

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
          <h1>Medical Dashboard</h1>
          <p className="sidebar__subtitle">GIS Operations Overview</p>
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
          {socketConnected ? 'Connected' : 'Disconnected'}
        </div>

        <div
          className={`mode-chip ${
            mode === 'historical' ? 'mode-chip--historical' : 'mode-chip--live'
          }`}
        >
          {mode === 'historical' ? 'Historical Mode' : 'Live Mode'}
        </div>
      </div>

      {!socketConnected && mode === 'live' ? (
        <p className="inline-error">
          Socket disconnected. Live updates are paused until reconnection.
        </p>
      ) : null}

      {children}
    </aside>
  );
}
