<script setup lang="ts">
import { MainLayout } from '@/shared/ui/layouts/main-layout'
import { AppNavbar } from '@/widgets/navbar'
import { RouterView } from 'vue-router'
import { Toaster } from '@/shared/ui/sonner'
import SettingsPage from '@/pages/settings'
</script>

<template>
  <Toaster />
  <div class="app">
    <MainLayout>
      <template #logo>
        <div class="app__logo-and-system-settings">
          <a
            href="https://github.com/simpledeadly/vue-from-scratch/tree/focuseek"
            target="_blank"
          >
            <img
              src="@/assets/logo_dark.png"
              class="app__logo"
              alt="logo"
            />
          </a>
          <SettingsPage />
        </div>
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
.app {
  margin-top: 1rem;
  // font-family: $font, $family;

  &__logo {
    width: 88px;
    margin: 0 auto;
    margin-left: 1.5rem;

    &-and-system-settings {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__bolt-icon {
    margin-left: 0.5rem;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    opacity: 0.5;

    &:hover {
      color: hsl(var(--foreground));
      opacity: 1;
    }
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
