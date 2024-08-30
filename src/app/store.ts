import type { ItemType } from '@/entities/Item/model/ItemModel'
import { defineStore } from 'pinia'
import { ref, shallowReactive } from 'vue'
import { db } from './data'

export const useItemsStore = defineStore('items', () => {
  const items: ItemType[] = shallowReactive(db)
  const hideChecked = ref<boolean>(false)

  return { items, hideChecked }
})
