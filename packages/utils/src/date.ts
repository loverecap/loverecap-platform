export function formatDate(dateString: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function daysBetween(a: string, b = new Date().toISOString()): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / msPerDay)
}
