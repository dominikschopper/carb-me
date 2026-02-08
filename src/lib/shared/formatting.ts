/**
 * Format number with German locale (comma as decimal separator)
 */
const germanNumberFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function formatNumber(value: number): string {
  return germanNumberFormatter.format(value);
}

/**
 * Format date with German locale
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

/**
 * Format date as short string (for history list)
 */
export function formatDateShort(timestamp: number): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}
