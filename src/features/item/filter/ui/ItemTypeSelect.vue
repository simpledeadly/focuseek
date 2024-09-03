<script setup lang="ts">
import type { ItemType } from '@/entities/item'

const model = defineModel<ItemType>()
</script>

<template>
  <select
    v-model="model"
    name="types"
    class="select"
  >
    <option value="inbox">Inbox</option>
    <option value="material">Material</option>
    <option value="todo">Todo</option>
    <option value="project">Project</option>
  </select>
</template>

<style lang="scss"></style>
