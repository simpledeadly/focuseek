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
import { useCollections } from '@/entities/collection'
import SettingsPage from '@/pages/settings'
import { ChevronDown, User2 } from 'lucide-vue-next'
import { useItems } from '@/entities/item'
import { useFilterItems } from '@/features/item/filter'

const { getUsername, getUserId } = useAuth()

const { items } = useItems()
const { itemType } = useFilterItems(items)

const { collections } = useCollections()

const route = useRoute()

const quitApp = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('auth')
  window.location.reload()
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
        <SidebarGroupLabel as-child>
          <RouterLink to="/collections">
            <span style="color: hsl(var(--foreground))">Collections</span>
          </RouterLink>
        </SidebarGroupLabel>
        <Transition
          name="fade"
          mode="out-in"
        >
          <SidebarMenu>
            <TransitionGroup name="fade-list">
              <div
                v-for="(col, idx) in collections"
                :key="col.id"
                :style="`--index: ${idx};`"
                class="sub-item"
              >
                <SidebarMenuItem
                  :class="
                    route.path.includes(col.title.toLowerCase())
                      ? 'sidebar__item_active'
                      : 'sidebar__item'
                  "
                >
                  <RouterLink :to="`/${col.title.toLowerCase()}`">
                    <SidebarMenuButton as-child>
                      <span>{{ col.title }}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge
                      class="gap-x-1"
                      :class="route.path.includes(col.title.toLowerCase()) && 'text-blue-400'"
                    >
                      <span
                        :class="
                          itemType === 'note' &&
                          route.path.includes(col.title.toLowerCase()) &&
                          'text-muted-foreground'
                        "
                      >
                        {{
                          items.filter((i) => i.collectionId === col.id && i.type === 'todo').length
                        }}
                      </span>
                      <span
                        :class="
                          itemType === 'todo' &&
                          route.path.includes(col.title.toLowerCase()) &&
                          'text-muted-foreground'
                        "
                      >
                        {{
                          items.filter((i) => i.collectionId === col.id && i.type === 'note').length
                        }}
                      </span>
                    </SidebarMenuBadge>
                  </RouterLink>
                </SidebarMenuItem>
              </div>
            </TransitionGroup>
          </SidebarMenu>
        </Transition>
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
    border-radius: 4px;

    &::before {
      border-radius: 4px;
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
      border-radius: 4px;
      background: hsl(var(--border));
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
