export function experienceFromDate(dateOfJoining: Date) {
  const start = new Date(dateOfJoining);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const safeMonths = Math.max(0, months);
  const years = Math.floor(safeMonths / 12);
  const remainderMonths = safeMonths % 12;
  return { months: safeMonths, years, remainderMonths };
}
