export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const auth = localStorage.getItem('auth')

  if (!token) {
    console.log('Токен не найден')
    return false
  }

  if (!auth) {
    console.log('userId не найден')
    return false
  }

  try {
    const parts = token.split('.')

    if (parts.length !== 3) {
      console.log('Невалидный токен, token:', token)
      return false
    }

    const payload = JSON.parse(atob(parts[1]))

    if (!payload || !payload.exp) {
      console.log('Невалидный payload')
      return false
    }

    const isExpired = payload.exp * 1000 < Date.now()
    return !isExpired
  } catch (e) {
    console.error('Ошибка при декодировании токена:', e)
    return false
  }
}
