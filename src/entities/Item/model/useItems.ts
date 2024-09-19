import { defineStore, storeToRefs } from 'pinia'
import { shallowRef } from 'vue'
import type { Item } from '../types/item'
import { db } from './db'

export const useItemsStore = defineStore('items', () => {
  const items = shallowRef<Item[]>(db)

  return { items }
})

export const useItems = () => {
  const { items } = storeToRefs(useItemsStore())

  return { items }
}
