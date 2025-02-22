import type { Item } from '../../entities/item/types/item'
import axios, { AxiosResponse } from 'axios'

export const fetchItemsFromServer = async (): Promise<Item[]> => {
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

export const addItemToServer = async (item: Item): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.post('http://localhost:3000/api/items', item)
    console.log('Элемент успешно добавлен на сервер:', response.data)
  } catch (e) {
    console.error('Ошибка при добавлении элемента на сервер:', e)
    throw new Error('Ошибка при добавлении элемента на сервер')
  }
}

export const deleteItemFromServer = async (id: number): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.delete(`http://localhost:3000/api/items/${id}`)
    console.log('Элемент успешно удалён с сервера:', response.data)
  } catch (e) {
    console.error('Ошибка при удалении элемента с сервера:', e)
    throw new Error('Ошибка при удалении элемента с сервера')
  }
}
