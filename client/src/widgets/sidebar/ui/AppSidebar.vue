<script setup lang="ts">
import { ChevronDown, User2 } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/shared/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import SettingsPage from '@/pages/settings'

const quitApp = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('auth')
  window.location.reload()
}
</script>

<template>
  <Sidebar class="sidebar">
    <SidebarTrigger />
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton>
                <User2 /> simpledeadly
                <ChevronDown class="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              class="w-[--reka-popper-anchor-width]"
            >
              <RouterLink to="/profile">
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
              </RouterLink>
              <RouterLink to="/settings">
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
              </RouterLink>
              <DropdownMenuItem @click="quitApp">
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel as-child>
          <RouterLink to="/collections">
            <span>Collections</span>
          </RouterLink>
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <RouterLink to="/inbox">
              <SidebarMenuButton as-child>
                <span>Inbox</span>
              </SidebarMenuButton>
            </RouterLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <RouterLink to="/today">
              <SidebarMenuButton as-child>
                <span>Today</span>
              </SidebarMenuButton>
            </RouterLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <RouterLink to="/focuseek">
              <SidebarMenuButton as-child>
                <span>Focuseek</span>
              </SidebarMenuButton>
            </RouterLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SettingsPage />
    </SidebarFooter>
  </Sidebar>
</template>

<style lang="scss">
.sidebar {
  background: hsl(var(--background));
}

.icon {
  margin-left: 0.5rem;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  opacity: 0.5;
  transition: 0.05s;

  &:hover {
    color: hsl(var(--foreground));
    opacity: 1;
  }
}
</style>
