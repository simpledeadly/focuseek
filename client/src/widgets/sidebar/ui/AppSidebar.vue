<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuth } from '@/app/auth/useAuth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
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
import { Separator } from '@/shared/ui/separator'
import { useCollections } from '@/entities/collection'
import { useItems } from '@/entities/item'
import SettingsPage from '@/pages/settings'
import { ChevronDown, User2 } from 'lucide-vue-next'

const { getUsername, getUserId } = useAuth()

const { collections, findIdByCollectionTitle } = useCollections()
const { items } = useItems()

const route = useRoute()

const quitApp = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('auth')
  window.location.reload()
}

const toPath = (title: string) => {
  return '/' + title.toLowerCase().replace(/\s+/g, '-')
}
</script>

<template>
  <Sidebar class="sidebar toast">
    <SidebarTrigger />
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton>
                <User2 />
                {{
                  getUsername === '1'
                    ? 'simpledeadly'
                    : getUsername === '2'
                      ? 'dev'
                      : 'User (id:' + getUserId + ')'
                }}
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
        <SidebarMenu>
          <div class="sub-item">
            <SidebarMenuItem
              :class="`sidebar__item${route.path === toPath('add') ? '_active' : ''}`"
            >
              <RouterLink to="/add">
                <SidebarMenuButton as-child>
                  <span>Add</span>
                </SidebarMenuButton>
              </RouterLink>
            </SidebarMenuItem>
          </div>
          <Separator />
          <div class="sub-item">
            <SidebarMenuItem
              :class="`sidebar__item${route.path === toPath('today') ? '_active' : ''}`"
            >
              <RouterLink to="/today">
                <SidebarMenuButton as-child>
                  <span>Today</span>
                </SidebarMenuButton>
              </RouterLink>
            </SidebarMenuItem>
          </div>
          <div class="sub-item">
            <SidebarMenuItem
              :class="`sidebar__item${route.path === toPath('upcoming') ? '_active' : ''}`"
            >
              <RouterLink to="/upcoming">
                <SidebarMenuButton as-child>
                  <span>Upcoming</span>
                </SidebarMenuButton>
              </RouterLink>
            </SidebarMenuItem>
          </div>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel as-child>
          <RouterLink to="/collections">
            <span style="color: hsl(var(--foreground))">Collections</span>
          </RouterLink>
        </SidebarGroupLabel>
        <SidebarMenu>
          <div
            v-for="(col, idx) in collections"
            :key="col.id"
            :style="`--index: ${idx};`"
            class="sub-item"
          >
            <SidebarMenuItem
              :class="`sidebar__item${route.path === toPath(col.title) ? '_active' : ''}`"
            >
              <RouterLink :to="toPath(col.title)">
                <SidebarMenuButton as-child>
                  <span>{{ col.title }}</span>
                </SidebarMenuButton>
                <SidebarMenuBadge v-if="col.title === 'Urgent'">
                  {{
                    items.filter((item) => item.collectionId === findIdByCollectionTitle('Urgent'))
                      .length - 1
                  }}
                </SidebarMenuBadge>
              </RouterLink>
            </SidebarMenuItem>
          </div>
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
  &__item {
    color: hsl(var(--muted-foreground));
    opacity: 0.6;
    position: relative;
    transition: color 0.05s ease;
    border-radius: 6px;

    &::before {
      border-radius: 6px;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: hsl(var(--border));
      opacity: 0;
      transition: opacity 0.05s ease;
      z-index: -1;
    }

    &:hover::before {
      opacity: 0.4;
    }

    &_active {
      border-radius: 6px;
      background: hsl(var(--border));
      font-weight: 500;
      // background: hsl(var(--foreground));
      // color: hsl(var(--background));
    }
  }
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
