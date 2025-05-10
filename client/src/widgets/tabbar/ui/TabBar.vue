<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeTab = computed({
  get: () => route.query.type?.toString() || 'todo',
  set: (value) => {
    router.push({ query: { ...route.query, type: value } })
  },
})
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
