import { defineStore } from 'pinia'
import { ref } from 'vue'

export type TypeTodo = {
  id: number
  text: string
  isDone: boolean
  isEditting: boolean
}

export const useTodosStore = defineStore('todos', () => {
  const todos = ref<TypeTodo[]>([
    { id: Date.now(), text: 'First todo to do :)', isDone: false, isEditting: false },
    { id: Date.now() + 1, text: 'Second todo to do ;D', isDone: false, isEditting: false },
    { id: Date.now() + 2, text: 'Third todo already done :3', isDone: true, isEditting: false }
  ])

  function addTodo(todo: TypeTodo) {
    todos.value.push(todo)
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter((todo: TypeTodo) => todo.id !== id)
  }

  return { todos, addTodo, removeTodo }
})
