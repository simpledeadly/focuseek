<script setup lang="ts">
import { AButton } from '@/components'
import { ref } from 'vue'

const counter = ref<number>(0)

function handleCount() {
  counter.value++
  console.log(counter.value)
}
</script>

<template>
  <h1>Home</h1>
  <AButton :counter="counter" @count="handleCount">Button</AButton>
</template>

<style lang="scss"></style>
