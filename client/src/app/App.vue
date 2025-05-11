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
import './styles/animations.scss'

const isLoading = ref(false)
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
      <AppSidebar />
      <MainLayout>
        <template #content>
          <Transition :name="transitionName">
            <RouterView />
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
</style>
