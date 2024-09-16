<script setup lang="ts">
import type { ItemType } from '@/entities/item'

const model = defineModel<ItemType>()
</script>

<template>
  <select
    v-model="model"
    class="select"
  >
    <option value="todo">Todo</option>
    <option value="material">Material</option>
    <option value="project">Project</option>
  </select>
</template>

<style lang="scss">
.select {
  background: $dark-bg;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 16px;
  outline: none;
}
</style>
