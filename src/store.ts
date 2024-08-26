import pick from 'lodash-es/pick'
import { defineStore } from 'pinia'
import { ref, shallowReactive } from 'vue'
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
  const hideChecked = ref<boolean>(false)

  const findIdx = (id: number) => items.findIndex((item) => item.id === id)

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
    const idx = findIdx(id)
    if (idx > -1) {
      const item = { ...items[idx], ...changes }
      items.splice(idx, 1, item)
    }
  }

  const changeType = (id: number, type: ChooseType) => {
    const idx = findIdx(id)
    if (idx === -1) {
      return
    }
    const item: ItemType = {
      ...pick(items[idx], ['id', 'title']),
      type
    }
    items.splice(idx, 1, modifyItemByType(item))
  }

  const removeItem = (id: number) => {
    const idx = findIdx(id)
    items.splice(idx, 1)
  }

  return { items, hideChecked, addItem, changeItem, changeType, removeItem }
})
