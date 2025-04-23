import jsonwebtoken from 'jsonwebtoken'

export const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'Неавторизованный доступ' })
  }

  try {
    const decoded = jsonwebtoken.verify(token, 'your_jwt_secret')
    console.log('DECODED:', decoded)

    if (typeof decoded === 'object' && decoded !== null) {
      req.userId = decoded.id
      next()
    } else {
      console.error('Проблема с decoded в middleware')
    }
  } catch (error) {
    console.error('Ошибка при проверке токена:', error)
    res.status(401).json({ message: 'Неправильный формат токена' })
  }
}
