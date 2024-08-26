<script setup lang="ts">
import { HideToggle, Navbar } from '@/components'
import { MainLayout } from '@/layouts'
import { RouterView } from 'vue-router'
import { useItemsStore } from './store'

const store = useItemsStore()
</script>

<template>
  <MainLayout>
    <template #nav>
      <Navbar />
    </template>
    <template #main>
      <main>
        <RouterView />
      </main>
    </template>
    <template #footer>
      <HideToggle v-model="store.hideChecked" />
    </template>
  </MainLayout>
</template>

<style lang="scss">
body {
  background: $bg;
  color: $color;
}
</style>
