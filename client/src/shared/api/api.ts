import { useAuth } from '@/app/useAuth'
import type { Item } from '../../entities/item/types/item'
import axios from 'axios'
import { User } from '@/entities/user/types/user'

const API_URL = 'http://localhost:3000/api'

// === USERS ===

const { setUserId, getUserId } = useAuth()

export const registerUser = async (username: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password })
    const userId = response.data.userId
    console.log('response.data register:', response.data)

    setUserId(userId)
    console.log(userId, 'reg SETTED!')

    return response.data
  } catch (e) {
    console.error('Ошибка при регистрации:', e)
    throw new Error('Ошибка при регистрации')
  }
}

export const loginUser = async (username: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password })
    const userId = response.data.userId
    console.log('response.data login:', response.data)

    setUserId(userId)
    console.log(userId, 'log SETTED!')
    
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    throw new Error('Ошибка входа')
  }
}

// === ITEMS ===

export const fetchItemsFromServer = async () => {
  try {
    console.log('GET Items', getUserId)
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/items`, {
      headers: {
        Authorization: token,
      },
    })
    console.log('Данные успешно получены:', response.data)
    return response.data
  } catch (error) {
    console.error('Ошибка при получении данных:', error)
    throw new Error('Ошибка при получении данных')
  }
}

export const addItemToServer = async (item: Item): Promise<Item> => {
  try {
    const token = localStorage.getItem('token')
    console.log('item:', item)
    const authStore = useAuth()

    if (authStore.userId === null) {
      throw new Error('Пользователь не авторизован')
    }
    item.userId = authStore.userId as number
    console.log('POST Item', item.userId)

    const response = await axios.post(`${API_URL}/items`, item, {
      headers: {
        Authorization: token,
      },
    })
    console.log('Элемент успешно добавлен на сервер:', response.data)
    return response.data.item
  } catch (e) {
    console.error('Ошибка при добавлении элемента на сервер:', e)
    throw new Error('Ошибка при добавлении элемента на сервере')
  }
}

export const updateItemOnServer = async (id: number, updatedItem: Item) => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.put(
      `${API_URL}/items/${id}`,
      updatedItem,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    console.log('Элемент успешно обновлён на сервере:', response.data)
  } catch (e) {
    console.error('Ошибка при обновлении элемента на сервере:', e)
    throw new Error('Ошибка при обновлении элемента на сервере')
  }
}

export const deleteItemFromServer = async (id: number) => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.delete(`http://localhost:3000/api/items/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    console.log('Элемент успешно удалён с сервера:', response.data)
  } catch (e) {
    console.error('Ошибка при удалении элемента с сервера:', e)
    throw new Error('Ошибка при удалении элемента с сервера')
  }
}
