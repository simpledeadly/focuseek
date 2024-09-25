<script setup lang="ts">
import { MainLayout } from '@/shared/ui/layouts/main-layout'
import { AppNavbar } from '@/widgets/navbar'
import { RouterView } from 'vue-router'
import { Toaster } from '@/shared/ui/sonner'
</script>

<template>
  <Toaster />
  <div class="app">
    <MainLayout>
      <template #logo>
        <a
          href="https://github.com/simpledeadly/vue-from-scratch/tree/focuseek"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="@/assets/logo_dark.png"
            class="app__logo"
            alt="logo"
          />
        </a>
      </template>
      <template #nav>
        <AppNavbar />
      </template>
      <template #main>
        <RouterView class="app__main" />
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

.app {
  &__logo {
    width: 88px;
    margin: 0 auto;
    margin-top: 1rem;
  }

  &__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>
