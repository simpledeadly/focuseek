<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { useFilters } from '@/features/item/filter'
import { CollectionOptions } from '@/features/collection/options'

const router = useRouter()

const { itemType: activeTab } = useFilters()
</script>

<template>
  <nav class="tab-bar">
    <div style="background: red; width: 38px; visibility: hidden" />
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
    <CollectionOptions />
  </nav>
</template>

<style lang="scss">
.tab-bar {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  margin-top: 0.25rem;

  &__container {
    text-align: center;
    width: 100%;
  }

  &__tabs {
    background: hsl(var(--primary-foreground));
    // border: 1px solid hsl(var(--border));
  }
}
</style>
