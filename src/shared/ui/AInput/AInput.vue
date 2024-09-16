<script setup lang="ts">
import { ref } from 'vue'

const text = ref<string>('')

const emit = defineEmits<{
  send: [string]
}>()

function handleEnter() {
  if (text.value.length !== 0) {
    emit('send', text.value)
  } else {
    alert('Enter text in input')
  }
  text.value = ''
}
</script>

<template>
  <input
    v-model="text"
    type="text"
    name="title"
    placeholder="type and press enter"
    class="input"
    @keyup.enter="handleEnter"
  />
</template>

<style lang="scss">
.input {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: $dark-bg;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 16px;
  outline: none;
}
</style>
