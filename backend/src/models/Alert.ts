export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export type AlertCategory = 'Hospital' | 'Ambulance' | 'Emergency' | 'System';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  createdAt: string;
  isRead: boolean;
}

export interface AlertRow {
  id: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  is_read: boolean;
  created_at: Date | string;
}

export function mapAlertRow(row: AlertRow): Alert {
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : new Date(row.created_at).toISOString();

  return {
    id: row.id,
    message: row.message,
    severity: row.severity,
    category: row.category,
    createdAt,
    isRead: Boolean(row.is_read),
  };
}
