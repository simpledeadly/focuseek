import pick from 'lodash-es/pick'
import { defineStore } from 'pinia'
import { shallowReactive } from 'vue'
import { db } from './data'

export type ChooseType = 'inbox' | 'material' | 'todo' | 'project'

export type ItemType = {
  id: number
  title: string
  type: ChooseType
  isDone?: boolean
  subtodos?: []
}

export const useItemsStore = defineStore('items', () => {
  const items: ItemType[] = shallowReactive(db)

  const modifyItemByType = (item: ItemType) => {
    const newItem = { ...item }
    if (['project', 'todo', 'inbox'].includes(item.type)) {
      newItem.isDone = false
    }
    if (item.type === 'project') {
      newItem.subtodos = []
    }
    return newItem
  }

  const addItem = (title: string, type: ChooseType) => {
    const item: ItemType = { id: Date.now(), type, title }
    items.push(modifyItemByType(item))
  }

  const changeItem = (id: number, changes: Partial<ItemType>) => {
    const idx = items.findIndex((item) => item.id === id)
    if (idx > -1) {
      const item = { ...items[idx], ...changes }
      items.splice(idx, 1, item)
    }
  }

  const changeType = (id: number, type: ChooseType) => {
    const idx = items.findIndex((item) => item.id === id)
    if (idx === -1) {
      return
    }
    const item: ItemType = {
      ...pick(items[idx], ['id', 'title']),
      type
    }
    items.splice(idx, 1, modifyItemByType(item))
    console.log(items)
  }

  const removeItem = (id: number) => {
    const idx = items.findIndex((item) => item.id === id)
    items.splice(idx, 1)
  }

  return { items, addItem, changeItem, changeType, removeItem }
})
