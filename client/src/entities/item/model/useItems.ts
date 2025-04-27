import { defineStore, storeToRefs } from 'pinia'
import { ref, shallowRef } from 'vue'
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

const undefinedItem: Item = {
  id: 0,
  title: '',
  type: 'todo',
  userId: 0,
  collectionId: 0,
  createdAt: 0,
  editedAt: 0,
}

export const useItemsStore = defineStore('items', () => {
  const items = shallowRef<Item[]>([])

  const savedItem = localStorage.getItem('selectedItem')
  const selectedItem = ref<Item>(savedItem ? JSON.parse(savedItem) : undefinedItem)

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

  const setSelectedItem = (item: Item | null) => {
    if (item) {
      selectedItem.value = item
      localStorage.setItem('selectedItem', JSON.stringify(item))
    } else {
      selectedItem.value = undefinedItem
      localStorage.removeItem('selectedItem')
    }
  }

  return { items, selectedItem, setSelectedItem }
})

export const useItems = () => {
  const { items } = storeToRefs(useItemsStore())
  const { selectedItem, setSelectedItem } = useItemsStore()

  return { items, selectedItem, setSelectedItem }
}
