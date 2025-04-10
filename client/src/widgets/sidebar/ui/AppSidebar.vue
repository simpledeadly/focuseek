<script setup lang="ts">
import { ChevronDown, User2 } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/shared/ui/sidebar'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import SettingsPage from '@/pages/settings'

// import { useCollections } from '@/entities/collection'

// const { collections } = useCollections()

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
      <!-- <SidebarGroup>
        <SidebarGroupLabel>Фичи</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <component :is="CirclePlus" />
                  <span>Добавить задачу</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <component :is="Search" />
                  <span>Поиск</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup> -->

      <!-- <SidebarGroup>
        <SidebarGroupLabel>Приложение</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/">
                  <span>Привычки</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/">
                  <span>TimeTrack</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/">
                  <span>Статистика</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup> -->

      <!-- <SidebarGroup>
        <SidebarGroupLabel>МЕСИВА ЖОСКАЕЕ</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <AddCollectionForm />
                <CollectionsList />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup> -->

      <SidebarGroup>
        <!-- <SidebarGroupLabel>Main</SidebarGroupLabel> -->
        <SidebarGroupContent>
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
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- <CollapsibleRoot
        :defaultOpen="false"
        class="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Избранное
              <ChevronDown
                class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
              />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/?type=note">
                    <span>Словарь</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/?type=project">
                    <span>Focuseek</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarGroup>
      </CollapsibleRoot> -->

      <CollapsibleRoot
        default-open
        class="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel as-child>
            <CollapsibleTrigger>
              <RouterLink to="/collections">
                <span>Collections</span>
              </RouterLink>
              <ChevronDown
                class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
              />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <RouterLink to="/focuseek">
                  <SidebarMenuButton as-child>
                    <span>Focuseek</span>
                  </SidebarMenuButton>
                </RouterLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarGroup>
      </CollapsibleRoot>
    </SidebarContent>

    <SidebarFooter>
      <SettingsPage />
    </SidebarFooter>
  </Sidebar>
</template>

<!-- <template>
  <Sidebar>
    <SidebarContent>
      <CollapsibleRoot
        defaultOpen
        class="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Help
              <ChevronDown
                class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
              />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarMenu>
              <SidebarMenuItem
                v-for="item in items"
                :key="item.title"
              >
                <SidebarMenuButton asChild>
                  <a :href="item.url">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge>{{ item.badge }}</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarGroup>
      </CollapsibleRoot>
      <CollapsibleRoot
        :default-open="false"
        class="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Other
              <ChevronDown
                class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
              />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarMenu>
              <SidebarMenuItem
                v-for="subItem in subItems"
                :key="subItem.id"
              >
                <SidebarMenuButton asChild>
                  <a :href="subItem.url">
                    <component :is="subItem.icon" />
                    <span>{{ subItem.title }}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuAction @click="toaster">
                  <Plus />
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarGroup>
      </CollapsibleRoot>
      <SidebarGroup>
        <SidebarGroupLabel>Чпоньк</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <CollapsibleRoot
              :default-open="false"
              class="group/collapsible"
              v-for="item in items"
              :key="item.id"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <span>{{ item.title }}</span>
                    </a>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub
                    v-for="subItem in subItems"
                    :key="subItem.id"
                  >
                    <SidebarMenuSubItem>
                      <a href="#">
                        <span>{{ subItem.title }}</span>
                      </a>
                    </SidebarMenuSubItem>
                    <SidebarMenuBadge>{{ subItem.badge }}</SidebarMenuBadge>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </CollapsibleRoot>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem> asdf </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template> -->

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
