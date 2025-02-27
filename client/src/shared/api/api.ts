import { useAuth } from '@/app/useAuth'
import type { Item } from '../../entities/item/types/item'
import axios from 'axios'
import { User } from '@/entities/user/types/user'

const API_URL = 'http://localhost:3000/api'

const { setUserId, getUserId } = useAuth()

// === USERS ===

// ! clean up logs

export const registerUser = async (username: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password })
    const userId = response.data.userId
    const token = response.data.token
    console.log('register userId:', userId)
    console.log('register token:', token)

    localStorage.setItem('token', token)
    setUserId(userId)

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
    const token = response.data.token
    console.log('login userId:', userId)
    console.log('login token:', token)

    localStorage.setItem('token', token)
    setUserId(userId)

    return response.data
  } catch (error) {
    throw new Error('Ошибка входа')
  }
}

// === ITEMS ===

export const fetchItemsFromServer = async () => {
  try {
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

    console.log('POST Item before', item.userId, getUserId)
    
    const response = await axios.post(`${API_URL}/items`, item, {
      headers: {
        Authorization: token,
      },
    })
    console.log('Элемент успешно добавлен на сервер:', response.data)
    console.log('POST Item after 2', item.userId, getUserId, response.data.item.userId)

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
