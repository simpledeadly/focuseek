import type { Item } from '../../entities/item/types/item'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

// === USERS ===

export const registerUser = async (username: string, password: string) => {
  try {
      const response = await axios.post(`${API_URL}/register`, { username, password })
      return response.data
  } catch (error) {
      throw new Error('Ошибка регистрации')
  }
}

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password })
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
      throw new Error('Ошибка входа')
  }
}

// === ITEMS ===

export const fetchItemsFromServer = async () => {
  try {
    const response = await axios.get<Item[]>(
      `${API_URL}/items`
    )
    return response.data
  } catch (e) {
    console.error('Ошибка при получении данных:', e)
    return []
  }
}

export const addItemToServer = async (item: Item) => {
  try {
    const response = await axios.post(`${API_URL}/items`, item)
    console.log('Элемент успешно добавлен на сервер:', response.data)
    return response.data;
  } catch (e) {
    console.error('Ошибка добавления элемента на сервер:', e)
    throw new Error('Ошибка добавления элемента на сервер')
  }
}

export const updateItemOnServer = async (id: number, updatedItem: Item) => {
  try {
    const response = await axios.put(
      `${API_URL}/items/${id}`,
      updatedItem
    )
    console.log('Элемент успешно обновлён на сервере:', response.data)
  } catch (e) {
    console.error('Ошибка при обновлении элемента на сервере:', e)
    throw new Error('Ошибка при обновлении элемента на сервере')
  }
}

export const deleteItemFromServer = async (id: number) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/items/${id}`)
    console.log('Элемент успешно удалён с сервера:', response.data)
  } catch (e) {
    console.error('Ошибка при удалении элемента с сервера:', e)
    throw new Error('Ошибка при удалении элемента с сервера')
  }
}
