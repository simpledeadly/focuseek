<script setup lang="ts">
import { ItemList } from '@/widgets/item-list'
import { TabBar } from '@/widgets/tabbar'
</script>

<template>
  <div class="notes-page">
    <TabBar />
    <ItemList />
  </div>
</template>

<style lang="scss">
.notes-page {
  /** keep */
}
</style>
