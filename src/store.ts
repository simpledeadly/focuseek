import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'
import { db } from './data'

export type ChooseType = 'inbox' | 'material' | 'todo' | 'project'

export type ItemType = {
  id: number
  title: string
  type: ChooseType
  isDone?: boolean
  subtodos?: []
  isEditting: boolean
}

export const useItemsStore = defineStore('items', () => {
  const items = ref<ItemType[]>(db)

  function addTodo(item: ItemType) {
    items.value.push(item)
  }

  function removeTodo(id: number) {
    items.value = toRaw(items.value.filter((item: ItemType) => item.id !== id))
  }

  function changeItemType(id: number) {
    const item = items.value.find((item) => item.id === id)

    switch (item?.type) {
      case 'material':
        item.isDone && delete item.isDone
        item.subtodos && delete item.subtodos
        break

      case 'project':
        !item.isDone && (item.isDone = false)
        !item.subtodos && (item.subtodos = [])
        break

      case 'todo' || 'inbox':
        !item.isDone && (item.isDone = false)
        item.subtodos && delete item.subtodos
        break
    }
    console.log('updated item:', toRaw(item))
    console.log('db:', toRaw(items.value))
  }

  return { items, addTodo, removeTodo, changeItemType }
})
