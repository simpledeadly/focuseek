<script setup lang="ts">
import { useItems } from '@/entities/item'

const { selectedItem } = useItems()
console.log(selectedItem)
</script>

<template>
  <div class="item-page">
    <h1 v-if="selectedItem">{{ selectedItem.title }}</h1>
    <h1 v-else>No Item Selected</h1>
  </div>
</template>

<style lang="scss">
.item-page {
  /** keep */
}
</style>
