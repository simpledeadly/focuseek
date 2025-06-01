import { defineStore, storeToRefs } from 'pinia'
import { reactive, ref, shallowRef } from 'vue'
import type { Item } from '../types/item'
import { fetchItemsFromServer } from '@/shared/api/api'
import { watch } from 'vue'

const fetchItems = async (): Promise<Item[]> => {
  try {
    return await fetchItemsFromServer()
  } catch (e) {
    console.error('Ошибка при загрузке данных:', e)
    return []
  }
}

// @ts-ignore
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
  const savedItemIndex = localStorage.getItem('selectedItemIndex')
  const item = ref<Item>(savedItem ? JSON.parse(savedItem) : undefinedItem)
  const itemIndex = ref<number>(savedItemIndex ? JSON.parse(savedItemIndex) : 0)

  const loadItems = async () => {
    try {
      const data = await fetchItems()

      const loadedItems = data
        .map((item: Item, index: number) => ({
          ...item,
          order: item.order ?? index + 1,
        }))
        .sort((a: Item, b: Item) => a.order - b.order)

      items.value = loadedItems
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    }
  }

  function updateOrderOfItem(id: number, newOrder: number) {
    items.value = items.value.map((item) => (item.id === id ? { ...item, order: newOrder } : item))
  }

  if (!items.value.length) {
    loadItems()
  }

  const setSelectedItem = (selectedItem: Item | null) => {
    if (selectedItem) {
      itemIndex.value = selectedItem.id
      item.value = reactive(selectedItem)
      localStorage.setItem('selectedItem', JSON.stringify(selectedItem))
      localStorage.setItem('selectedItemIndex', JSON.stringify(selectedItem.id))
    } else {
      item.value = undefinedItem
      localStorage.removeItem('selectedItem')
      localStorage.removeItem('selectedItemIndex')
    }
  }

  watch(
    item,
    (newVal) => {
      if (newVal && newVal !== undefinedItem) {
        localStorage.setItem('selectedItem', JSON.stringify(newVal))
      } else {
        localStorage.removeItem('selectedItem')
      }
    },
    { deep: true }
  )

  return { items, item, itemIndex, updateOrderOfItem, setSelectedItem }
})

export const useItems = () => {
  const { items, item, itemIndex } = storeToRefs(useItemsStore())
  const { updateOrderOfItem, setSelectedItem } = useItemsStore()

  return { items, item, itemIndex, updateOrderOfItem, setSelectedItem }
}
