export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const isExpired = payload.exp * 1000 < Date.now()
    return !isExpired
  } catch (e) {
    return false // Если ошибка при декодировании, считаем токен недействительным
  }
}
