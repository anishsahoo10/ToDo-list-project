/**
 * Utility functions for date manipulation and comparison
 */

/**
 * Normalize a date to midnight (00:00:00.000) for day-level comparison
 */
export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return normalizeDate(date1).getTime() === normalizeDate(date2).getTime();
}

/**
 * Check if date1 is before date2 (day-level comparison)
 */
export function isBeforeDay(date1: Date, date2: Date): boolean {
  return normalizeDate(date1).getTime() < normalizeDate(date2).getTime();
}

/**
 * Check if date1 is after date2 (day-level comparison)
 */
export function isAfterDay(date1: Date, date2: Date): boolean {
  return normalizeDate(date1).getTime() > normalizeDate(date2).getTime();
}

/**
 * Get today's date normalized to midnight
 */
export function getToday(): Date {
  return normalizeDate(new Date());
}

/**
 * Format date to YYYY-MM-DD for input fields
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Create a Date from date string (YYYY-MM-DD) and time string (HH:MM)
 */
export function createDateFromInputs(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}
