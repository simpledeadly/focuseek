<script setup lang="ts">
import { useTodosStore, type TypeTodo } from '@/store'
import { ref } from 'vue'

const newText = ref<string>('')

const props = defineProps<{
  todo: TypeTodo
}>()

const store = useTodosStore()

function handleStartEditting() {
  props.todo.isEditting = true
  newText.value = props.todo.text
}

function handleCancel() {
  props.todo.text = newText.value
  props.todo.isEditting = false
}
</script>

<template>
  <li class="list-item">
    <div v-if="!todo.isEditting" class="container">
      <input type="checkbox" v-model="todo.isDone" />
      <div :class="todo.isDone && 'done-task'">{{ todo.text }}</div>
      <div class="action" @click="handleStartEditting">ㅤ✎</div>
      <div class="action" @click="store.removeTodo(todo.id)">ㅤ&times;</div>
    </div>
    <div v-else class="container">
      <input class="input-editting" type="text" v-model="todo.text" />
      <button class="button-action" @click="todo.isEditting = false">✓</button>
      <button class="button-action" @click="handleCancel">&times;</button>
    </div>
  </li>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
