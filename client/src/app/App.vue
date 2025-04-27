<script setup lang="ts">
import { ref } from 'vue'
import { Toaster } from '@/shared/ui/sonner'
import { TooltipProvider } from '@/shared/ui/tooltip'
import { MainLayout } from '@/shared/ui/layouts/main-layout'
import { AppSidebar } from '@/widgets/sidebar'
import { SidebarProvider } from '@/shared/ui/sidebar'
import { RouterView } from 'vue-router'
import { isAuthenticated } from './auth/auth'
import { AuthLayout } from '@/shared/ui/layouts/auth-layout'
import Loader from '@/widgets/loader'

const isLoading = ref(false)
const setLoading = (value: boolean) => (isLoading.value = value)
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
      <!-- <SidebarTrigger /> -->
      <MainLayout>
        <template #content>
          <RouterView />
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
