export function formatDate(
  possibleDate: string | Date,
  locale?: string,
): string {
  const date =
    typeof possibleDate === 'string' ? new Date(possibleDate) : possibleDate;

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
