export function formatDate(possibleDate: string | Date): string {
  const date =
    typeof possibleDate === 'string' ? new Date(possibleDate) : possibleDate;

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
