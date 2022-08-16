export const formatDate = (date: Date) => {
  let formattedDate = new Date(date)
  return formattedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
