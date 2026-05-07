export type HistoryDateBucket = 'today' | 'yesterday' | 'week' | 'older';

export function bucketForCreatedAt(iso: string): HistoryDateBucket {
  const d = new Date(iso);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startToday.getTime() - startD.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays <= 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return 'week';
  return 'older';
}

export function bucketLabel(bucket: HistoryDateBucket): string {
  switch (bucket) {
    case 'today':
      return 'Today';
    case 'yesterday':
      return 'Yesterday';
    case 'week':
      return 'Last 7 days';
    default:
      return 'Older';
  }
}
