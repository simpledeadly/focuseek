<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from '@/shared/ui/sonner'
import { TooltipProvider } from '@/shared/ui/tooltip'
import { SidebarProvider } from '@/shared/ui/sidebar'
import { MainLayout } from '@/shared/ui/layouts/main-layout'
import { AuthLayout } from '@/shared/ui/layouts/auth-layout'
import { AppSidebar } from '@/widgets/sidebar'
import { Loader } from '@/widgets/loader'
import { isAuthenticated } from './auth/auth'
import { Collection } from '@/entities/collection'

const isLoading = ref(false)
const collections = ref<Collection[]>([])
const setLoading = (value: boolean) => (isLoading.value = value)

const transitionName = computed<any>(() => 'dissolve-smooth')
</script>

<template>
  <TooltipProvider :delay-duration="400">
    <Toaster
      theme="system"
      position="bottom-right"
      :expand="false"
      :close-button="false"
    />
    <Loader v-if="isLoading" />
    <SidebarProvider v-if="isAuthenticated()">
      <AppSidebar :collections="collections" />
      <MainLayout>
        <template #content>
          <Transition
            :name="transitionName"
            mode="out-in"
          >
            <RouterView @collections="collections = $event" />
          </Transition>
        </template>
      </MainLayout>
    </SidebarProvider>
    <AuthLayout v-else>
      <template #form>
        <RouterView @loading="(value: boolean) => setLoading(value)" />
      </template>
    </AuthLayout>
  </TooltipProvider>
</template>

<style lang="scss">
.app {
  /** keep */
}

.toast {
  animation-duration: 75ms !important;
  background: hsl(var(--primary-foreground)) !important;
  border: 1px solid hsl(var(--border));
}

.dissolve-enter-active,
.dissolve-leave-active {
  transition: opacity 0.1s ease;
}

.dissolve-enter-from,
.dissolve-leave-to {
  opacity: 0;
}

.dissolve-enter-to,
.dissolve-leave-from {
  opacity: 1;
}

.dissolve-smooth-move,
.dissolve-smooth-enter-active,
.dissolve-smooth-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.dissolve-smooth-enter-from,
.dissolve-smooth-leave-to {
  opacity: 0;
  transform: translateY(10px);
  position: absolute;
  width: 100%;
}

.dissolve-smooth-enter-to,
.dissolve-smooth-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dissolve-smooth-leave-active {
  position: absolute;
  width: 100%;
}
</style>
