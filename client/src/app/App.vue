<script setup lang="ts">
import { ref } from 'vue'
import { MainLayout } from '@/shared/ui/layouts/main-layout'
import { AppNavbar } from '@/widgets/navbar'
import { RouterView } from 'vue-router'
import { Toaster } from '@/shared/ui/sonner'
import { isAuthenticated } from './auth'
import { ArrowRightSquare } from 'lucide-vue-next'
import SettingsPage from '@/pages/settings'
import Loader from '@/widgets/loader'
import ProfilePage from '@/pages/profile/ui/ProfilePage.vue'

const quitApp = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('auth')
  window.location.reload()
}

const isLoading = ref(false)
const setLoading = (value: boolean) => isLoading.value = value
</script>

<template>
  <Toaster />
  <Loader v-if="isLoading" />
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
          <div :style="{ visibility: !isAuthenticated() ? 'hidden' : 'visible' }" class="app__icons">
            <ProfilePage />
            <SettingsPage />
            <ArrowRightSquare
              :size="18"
              class="app__icons_quit-icon icon"
              @click="quitApp"
            />
          </div>
        </div>
      </template>
      <template v-if="isAuthenticated()" #nav>
        <AppNavbar />
      </template>
      <template #main>
        <RouterView @loading="(value: boolean) => setLoading(value)" class="app__main" />
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
    margin-left: 4.5rem;

    &-and-system-settings {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__icons {
    display: flex;
  }

  .icon {
    transition: 0.05s;
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
