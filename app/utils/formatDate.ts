export const formatDate = (dateString?: string | number | Date | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}