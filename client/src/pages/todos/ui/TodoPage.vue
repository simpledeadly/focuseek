<script setup lang="ts">
import { ItemList } from '@/widgets/item-list'
import { TabBar } from '@/widgets/tabbar'
</script>

<template>
  <div class="home-page">
    <TabBar />
    <ItemList />
  </div>
</template>

<style lang="scss">
.home-page {
  /** keep */
}
</style>
