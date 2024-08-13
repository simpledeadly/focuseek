import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ChooseType = 'inbox' | 'material' | 'todo' | 'project'

export type ItemType = {
  id: number
  title: string
  type: ChooseType
  isDone?: boolean
  subtodos?: []
  isEditting: boolean
}

const db: ItemType[] = [
  {
    id: Date.now(),
    title: 'First todo to do :)',
    type: 'todo',
    isDone: false,
    isEditting: false
  },
  {
    id: Date.now() + 1,
    title: 'Second todo to do ;D',
    type: 'todo',
    isDone: false,
    isEditting: false
  },
  {
    id: Date.now() + 2,
    title: 'Third todo already done :3',
    type: 'todo',
    isDone: true,
    isEditting: false
  }
]

export const useItemsStore = defineStore('items', () => {
  const items = ref<ItemType[]>(db)

  function addTodo(item: ItemType) {
    items.value.push(item)
  }

  function removeTodo(id: number) {
    items.value = items.value.filter((item: ItemType) => item.id !== id)
  }

  return { items, addTodo, removeTodo }
})
