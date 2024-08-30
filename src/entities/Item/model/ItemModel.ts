import { useItemsStore } from '@/app/store'
import { findIdx } from '@/shared/lib/utils'
import { pick } from 'lodash-es'

export type ChooseType = 'inbox' | 'material' | 'todo' | 'project'

export type ItemType = {
  id: number
  title: string
  type: ChooseType
  isDone?: boolean
  subtodos?: []
}

export const ItemModel = () => {
  const store = useItemsStore()

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
    store.items.push(modifyItemByType(item))
  }

  const changeItem = (id: number, changes: Partial<ItemType>) => {
    const idx = findIdx(store.items, id)
    if (idx > -1) {
      const item = { ...store.items[idx], ...changes }
      store.items.splice(idx, 1, item)
    }
  }

  const changeItemType = (id: number, type: ChooseType) => {
    const idx = findIdx(store.items, id)
    if (idx === -1) {
      return
    }
    const item: ItemType = {
      ...pick(store.items[idx], ['id', 'title']),
      type
    }
    store.items.splice(idx, 1, modifyItemByType(item))
  }

  const removeItem = (id: number) => {
    const idx = findIdx(store.items, id)
    store.items.splice(idx, 1)
  }

  return { addItem, changeItem, changeItemType, removeItem }
}
