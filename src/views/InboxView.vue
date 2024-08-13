<script setup lang="ts">
import { AInput } from '@/components'
import type { Ref } from 'vue'

function handleSend(text: Ref<string>) {
  alert(text.value)
}
</script>

<template>
  <h1>About</h1>
  <AInput @send="(text: Ref<string>) => handleSend(text)" />
</template>

<style lang="scss"></style>
