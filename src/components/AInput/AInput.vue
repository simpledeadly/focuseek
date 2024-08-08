<script setup lang="ts">
import { ref } from 'vue'

const text = ref<string>('')

const emit = defineEmits(['send'])

function handleEnter() {
  text.value.length !== 0 ? emit('send', text) : alert('Enter text in input')
  text.value = ''
}
</script>

<template>
  <input @keyup.enter="handleEnter" v-model="text" type="text" placeholder="enter" class="input" />
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
