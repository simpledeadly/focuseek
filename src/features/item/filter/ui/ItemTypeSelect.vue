<script setup lang="ts">
import type { ItemType } from '@/entities/item'

const model = defineModel<ItemType>()
</script>

<template>
  <select
    v-model="model"
    class="item-type-select"
  >
    <option value="todo">Todo</option>
    <option value="material">Material</option>
    <option value="project">Project</option>
  </select>
</template>

<style lang="scss">
.item-type-select {
  /** keep */
}
</style>
