export function formatToDateID(date: string | number | Date) {
  return new Intl.DateTimeFormat('id', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Asia/Makassar'
  }).format(new Date(date))
}
