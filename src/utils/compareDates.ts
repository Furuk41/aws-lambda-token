export function compareDates(
  date1: Date,
  date2: Date,
  maxDifByMinutes: number
): boolean {
  const timeDifference = Math.abs(date2.getTime() - date1.getTime()); // Get the time difference in milliseconds
  const minutesDifference = timeDifference / (1000 * 60); // Convert milliseconds to minutes

  return minutesDifference <= maxDifByMinutes;
}
