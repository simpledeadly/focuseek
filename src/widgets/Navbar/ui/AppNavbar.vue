<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
// import { useItemType } from '@/features/item/filter'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
// const { itemType } = useItemType()
// console.log(itemType.value)
</script>

<template>
  <nav class="app-navbar">
    <Tabs
      default-value="todo"
      class="w-[400px] app-navbar__container"
    >
      <TabsList>
        <RouterLink to="/">
          <TabsTrigger value="todo">Todos</TabsTrigger>
        </RouterLink>
        <RouterLink to="/?type=note">
          <TabsTrigger value="note">Notes</TabsTrigger>
        </RouterLink>
        <RouterLink to="/?type=project">
          <TabsTrigger value="project">Projects</TabsTrigger>
        </RouterLink>
      </TabsList>
    </Tabs>
    <!-- <button @click="mode = 'light'">light</button> |
    <button @click="mode = 'dark'">dark</button> -->
  </nav>
</template>

<style lang="scss">
.app-navbar {
  &__container {
    margin: 0 auto;
    margin-top: 0.25rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
}
</style>
