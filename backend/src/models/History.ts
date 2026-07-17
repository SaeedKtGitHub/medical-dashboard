export interface HistorySnapshot {
  id: string;
  createdAt: string;
}

export interface HistorySnapshotRow {
  id: string;
  created_at: Date | string;
}

export function mapHistorySnapshotRow(row: HistorySnapshotRow): HistorySnapshot {
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : new Date(row.created_at).toISOString();

  return {
    id: row.id,
    createdAt,
  };
}
