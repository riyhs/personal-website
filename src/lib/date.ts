const SHORT_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const LONG_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatShortDate(date: string) {
  return SHORT_DATE_FORMAT.format(new Date(date))
}

export function formatLongDate(date: string) {
  return LONG_DATE_FORMAT.format(new Date(date))
}
