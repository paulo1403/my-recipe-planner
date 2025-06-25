/**
 * Formats a date string to a human-readable format
 * @param dateString Date string in ISO format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Returns the name of the day of week for a given date
 * @param date Date object or date string
 * @returns Day name in Spanish
 */
export function getDayName(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es', { weekday: 'long' }).format(dateObj);
}

/**
 * Returns the short name of the day of week for a given day number
 * @param dayOfWeek Day number (1-7, where 1 is Monday)
 * @returns Short day name
 */
export function getDayNameFromNumber(dayOfWeek: number): string {
  // In JavaScript, 0 = Sunday, but in our app 1 = Monday
  const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
  return days[dayOfWeek === 7 ? 0 : dayOfWeek];
}

/**
 * Gets an array of dates for a date range
 * @param startDate Start date string
 * @param endDate End date string
 * @returns Array of dates in the range
 */
export function getDateRange(startDate: string, endDate: string): Date[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const dates: Date[] = [];
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * Gets the day of week number (1-7) for a date
 * @param date Date object or date string
 * @returns Day number (1 = Monday, 7 = Sunday)
 */
export function getDayOfWeek(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // getDay returns 0 for Sunday, 1 for Monday, etc.
  // We want 1 for Monday through 7 for Sunday
  const day = dateObj.getDay();
  return day === 0 ? 7 : day;
}
