<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from '@/shared/ui/sonner'
import { TooltipProvider } from '@/shared/ui/tooltip'
import { SidebarProvider } from '@/shared/ui/sidebar'
import { MainLayout } from '@/shared/ui/layouts/main-layout'
import { AuthLayout } from '@/shared/ui/layouts/auth-layout'
import { Loader } from '@/widgets/loader'
import { AppSidebar } from '@/widgets/sidebar'
import { BreakAlert } from '@/widgets/break-alert'
import { useLoading } from './useLoading'
import { isAuthenticated } from './auth/auth'
import './styles/animations.scss'

const { isLoading, setLoading } = useLoading()

const transitionName = computed<any>(() => 'dissolve-smooth')
</script>

<template>
  <BreakAlert />
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
          <RouterView v-slot="{ Component }">
            <Transition :name="transitionName">
              <component :is="Component" />
            </Transition>
          </RouterView>
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
  animation-duration: 100ms !important;
  background: hsl(var(--primary-foreground)) !important;
  border: 1px solid hsl(var(--border));
}
</style>
