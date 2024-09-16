<script setup lang="ts">
import { useFilterItems } from '@/features/item/filter'
import ItemList from './ItemList.vue'

const { filteredItems } = useFilterItems()
</script>

<template>
  <ItemList
    v-slot="{ subtodos }"
    :items="filteredItems"
  >
    <ItemList :items="subtodos" />
  </ItemList>
</template>
