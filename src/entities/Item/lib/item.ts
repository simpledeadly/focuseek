import type { Item, ItemType } from '../types/item'

export const isItemType = (value: unknown): value is ItemType => {
  const types: unknown[] = ['todo', 'note', 'project']
  return types.includes(value)
}

export const createItem = (title: string, type: ItemType): Item => {
  return { id: Date.now(), type, title }
}

export const updateItem = (item: Item, changes: Partial<Item>): Item => {
  return { ...item, ...changes }
}

export const addItemToList = (itemList: Item[], item: Item): Item[] => {
  return [...itemList, item]
}

export const removeItemFromListById = (itemList: Item[], id: number): Item[] => {
  const idx = itemList.findIndex((item) => item.id === id)
  if (idx > -1) {
    return [...itemList.slice(0, idx), ...itemList.slice(idx + 1)]
  }
  return itemList
}

export const replaceItemInList = (itemList: Item[], newItem: Item): Item[] => {
  const idx = itemList.findIndex((item) => item.id === newItem.id)
  if (idx > -1) {
    return [...itemList.slice(0, idx), newItem, ...itemList.slice(idx + 1)]
  }
  return itemList
}

export const filterItemsByType = (itemList: Item[], type: ItemType): Item[] => {
  return itemList.filter((item) => item.type === type)
}
