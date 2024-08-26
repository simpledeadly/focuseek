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
    @keyup.enter="handleEnter"
    v-model="text"
    type="text"
    name="title"
    placeholder="type and press enter"
    class="input"
  />
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
