<script setup lang="ts">
import { Collection, useCollections } from '@/entities/collection'
import { ItemListGroup } from '@/widgets/item-list'
import { TabBar } from '@/widgets/tabbar'

const emit = defineEmits<{
  (e: 'collections', value: Collection[]): void
  (e: 'user', value: Collection[]): void
}>()

const { collections } = useCollections()

setTimeout(() => {
  emit('collections', collections.value)
}, 100)
</script>

<template>
  <div class="list-page">
    <TabBar />
    <ItemListGroup />
  </div>
</template>

<style lang="scss">
.list-page {
  /** keep */
}
</style>
