export function getDayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function getWeekRange(date: Date) {
  const input = new Date(date);

  // Sunday = 0, Monday = 1, ..., Saturday = 6
  const dayOfWeek = input.getDay();

  // Start of week (Sunday)
  const startOfWeek = new Date(input);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(input.getDate() - dayOfWeek);

  // End of week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { start: startOfWeek, end: endOfWeek };
}
