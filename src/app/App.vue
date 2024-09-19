<script setup lang="ts">
import { MainLayout } from '@/shared/ui/layouts/main-layout'
import { AppNavbar } from '@/widgets/navbar'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <MainLayout>
      <template #nav>
        <AppNavbar />
      </template>
      <template #main>
        <RouterView />
      </template>
      <!-- <template #footer></template> -->
    </MainLayout>
  </div>
</template>

<style lang="scss">
body {
  color: $color;
  background: $bg;
}
</style>
