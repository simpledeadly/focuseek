import { defineStore, storeToRefs } from 'pinia'
import { shallowRef } from 'vue'
import { addItemToList, removeItemFromListById, replaceItemInList } from '../lib/item'
import type { Item } from '../types/item'
import { db } from './db'

export const useItemsStore = defineStore('items', () => {
  const items = shallowRef<Item[]>(db)

  return { items }
})

export const useItems = () => {
  const { items } = storeToRefs(useItemsStore())

  const addItemToStorage = (item: Item) => {
    items.value = addItemToList(items.value, item)
  }

  const replaceItemInStorage = (item: Item) => {
    items.value = replaceItemInList(items.value, item)
  }

  const removeItemFromStorage = (item: Item) => {
    items.value = removeItemFromListById(items.value, item.id)
  }

  return { items, addItemToStorage, replaceItemInStorage, removeItemFromStorage }
}
