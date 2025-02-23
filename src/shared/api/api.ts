import type { Item } from '../../entities/item/types/item'
import axios, { AxiosResponse } from 'axios'

export const fetchItemsFromServer = async () => {
  try {
    const response: AxiosResponse<Item[]> = await axios.get<Item[]>(
      'http://localhost:3000/api/items'
    )
    return response.data
  } catch (e) {
    console.error('Ошибка при получении данных:', e)
    return []
  }
}

export const addItemToServer = async (item: Item) => {
  try {
    const response: AxiosResponse = await axios.post('http://localhost:3000/api/items', item)
    console.log('Элемент успешно добавлен на сервер:', response.data)
  } catch (e) {
    console.error('Ошибка при добавлении элемента на сервер:', e)
    throw new Error('Ошибка при добавлении элемента на сервер')
  }
}

export const updateItemOnServer = async (id: number, updatedItem: Item) => {
  try {
    const response: AxiosResponse = await axios.put(
      `http://localhost:3000/api/items/${id}`,
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
    const response: AxiosResponse = await axios.delete(`http://localhost:3000/api/items/${id}`)
    console.log('Элемент успешно удалён с сервера:', response.data)
  } catch (e) {
    console.error('Ошибка при удалении элемента с сервера:', e)
    throw new Error('Ошибка при удалении элемента с сервера')
  }
}
