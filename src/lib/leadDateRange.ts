export type LeadDatePreset = 'all' | 'today' | 'yesterday' | 'custom';

export interface CreatedAtRange {
  startIso: string;
  endIso: string;
}

export function toLocalYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalYmd(ymd: string): Date {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function getDayBounds(date: Date): CreatedAtRange {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    startIso: startOfDay.toISOString(),
    endIso: endOfDay.toISOString(),
  };
}

export function getCreatedAtRange(
  preset: LeadDatePreset,
  selectedDay: string | null,
): CreatedAtRange | null {
  if (preset === 'all') {
    return null;
  }

  if (preset === 'today') {
    return getDayBounds(new Date());
  }

  if (preset === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getDayBounds(yesterday);
  }

  if (preset === 'custom' && selectedDay) {
    return getDayBounds(parseLocalYmd(selectedDay));
  }

  return null;
}

export function formatLeadDateFilterLabel(
  preset: LeadDatePreset,
  selectedDay: string | null,
): string {
  if (preset === 'today') {
    return 'Today (Live)';
  }

  if (preset === 'yesterday') {
    return 'Yesterday';
  }

  if (preset === 'custom' && selectedDay) {
    return parseLocalYmd(selectedDay).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return 'All Leads';
}
