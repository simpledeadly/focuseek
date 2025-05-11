<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ItemType, useItems } from '@/entities/item'
import { useFilterItems } from '@/features/item/filter'

const router = useRouter()

const { items } = useItems()
const { filters } = useFilterItems(items)

const activeTab = ref<ItemType>(filters.itemType)

watch(activeTab, (newVal) => (filters.itemType = newVal))
</script>

<template>
  <nav class="tab-bar">
    <Tabs
      v-model="activeTab"
      class="w-[400px] tab-bar__container"
    >
      <TabsList class="tab-bar__tabs">
        <TabsTrigger
          @click="router.push({ query: { ...$route.query, type: 'todo' } })"
          value="todo"
          >Todos</TabsTrigger
        >
        <TabsTrigger
          @click="router.push({ query: { ...$route.query, type: 'note' } })"
          value="note"
          >Notes</TabsTrigger
        >
      </TabsList>
    </Tabs>
  </nav>
</template>

<style lang="scss">
.tab-bar {
  &__container {
    margin: 0 auto;
    margin-top: 0.25rem;
    margin-bottom: 1.5rem;
    text-align: center;
    width: 100%;
  }

  &__tabs {
    background: hsl(var(--primary-foreground)) !important;
    border: 1px solid hsl(var(--border));
  }
}
</style>
