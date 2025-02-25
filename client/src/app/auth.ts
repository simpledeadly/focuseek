// export const isAuthenticated = () => {
//   const token = localStorage.getItem('token')
//   return token !== null
// }

// import axios from 'axios'

export const isAuthenticated = () => {
  // console.log('Проверка авторизации...')
  const token = localStorage.getItem('token')
  // console.log('Токен:', token)

  if (!token) {
    console.log('Токен не найден')
    return false
  }

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.log('Невалидный токен')
      return false
    }

    const payload = JSON.parse(atob(parts[1]))
    // console.log('Payload:', payload)

    if (!payload || !payload.exp) {
      console.log('Невалидный payload')
      return false
    }

    const isExpired = payload.exp * 1000 < Date.now()
    // console.log('Токен истек:', isExpired)
    return !isExpired
  } catch (e) {
    console.error('Ошибка при декодировании токена:', e)
    return false
  }
}


// export const isAuthenticated = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/api/check-token', {
//       headers: {
//         Authorization: localStorage.getItem('token'),
//       },
//     })
//     return response.data.isValid
//   } catch (error) {
//     console.error('Ошибка при проверке токена:', error)
//     return false
//   }
// }
