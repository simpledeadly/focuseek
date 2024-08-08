<script setup lang="ts">
import { AInput, ListItem } from '@/components'
import { useTodosStore, type TypeTodo } from '@/store'
import type { Ref } from 'vue'

const store = useTodosStore()

function handleAddTodo(text: Ref<string>) {
  const newTodo: TypeTodo = {
    id: Date.now(),
    text: text.value,
    isDone: false,
    isEditting: false
  }
  store.addTodo(newTodo)
}
</script>

<template>
  <AInput @send="(text: Ref<string>) => handleAddTodo(text)" />
  <ul v-if="store.todos.length !== 0" class="list">
    <ListItem v-for="todo in store.todos" :todo="todo" />
  </ul>
  <p v-else>No todos!</p>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
