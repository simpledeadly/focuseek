import { defineStore, storeToRefs } from 'pinia'
import { shallowRef } from 'vue'
import type { Item } from '../types/item'
import { fetchItemsFromServer } from '@/shared/api/api'

const fetchItems = async (): Promise<Item[]> => {
  try {
    return await fetchItemsFromServer()
  } catch (e) {
    console.error('Ошибка при загрузке данных:', e)
    return []
  }
}

export const useItemsStore = defineStore('items', () => {
  const items = shallowRef<Item[]>([])

  const loadItems = async () => {
    try {
      items.value = await fetchItems()
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    }
  }

  if (!items.value.length) {
    loadItems()
  }

  return { items, loadItems }
})

export const useItems = () => {
  const { items } = storeToRefs(useItemsStore())

  return { items }
}
