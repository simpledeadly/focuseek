<script setup lang="ts">
import { MainLayout } from '@/shared/ui/layouts/main-layout'
import { AppNavbar } from '@/widgets/navbar'
import { RouterView } from 'vue-router'
import { Toaster } from '@/shared/ui/sonner'
import { isAuthenticated } from './auth'
import { ArrowRightSquare } from 'lucide-vue-next'
import SettingsPage from '@/pages/settings'

const leftApp = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('auth')
  window.location.reload()
}
</script>

<template>
  <Toaster />
  <!-- <Loader :show="isLoading" /> -->
  <div class="app">
    <MainLayout>
      <template #logo>
        <div class="app__logo-and-system-settings">
          <a
            href="https://github.com/simpledeadly/Focuseek"
            target="_blank"
          >
            <img
              src="@/assets/logo_dark.png"
              class="app__logo"
              alt="logo"
            />
          </a>
          <SettingsPage />
          <ArrowRightSquare
            :size="18"
            class="app__left-icon"
            @click="leftApp"
          />
        </div>
      </template>
      <template v-if="isAuthenticated()" #nav>
        <AppNavbar />
      </template>
      <template #main>
        <RouterView class="app__main" />
      </template>
    </MainLayout>
  </div>
</template>

<style lang="scss">
.app {
  margin-top: 1rem;

  &__logo {
    width: 88px;
    margin: 0 auto;
    margin-left: 3rem;

    &-and-system-settings {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__bolt-icon, &__left-icon {
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
