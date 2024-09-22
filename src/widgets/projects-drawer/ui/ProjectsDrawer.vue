<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer'
import { PanelBottomOpen } from 'lucide-vue-next'

defineSlots<{
  title: () => unknown
  stats: () => unknown
  form: () => unknown
  content: () => unknown
}>()
</script>

<template>
  <Drawer class="projects-drawer">
    <DrawerTrigger class="projects-drawer__trigger">
      <PanelBottomOpen :size="17" />
    </DrawerTrigger>
    <DrawerContent class="projects-drawer__content">
      <div class="projects-drawer__container">
        <DrawerHeader class="projects-drawer__header">
          <DrawerTitle class="projects-drawer__title">
            <slot name="title" />
          </DrawerTitle>
          <p class="projects-drawer__project-stats">
            <slot name="stats" />
          </p>
        </DrawerHeader>
        <div class="pl-4">
          <div class="projects-drawer__form">
            <slot name="form" />
          </div>
          <slot name="content" />
        </div>
      </div>
      <DrawerFooter>
        <DrawerClose>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<style lang="scss">
.projects-drawer {
  &__trigger {
    display: flex;
  }

  &__content {
    height: 60vh;
    outline: none;
  }

  &__container {
    min-width: 80vw;
    margin: 0 auto;
    text-align: left;
  }

  &__title {
    display: flex;
  }

  &__project-stats {
    font-size: 14px;
    opacity: 0.8;
  }

  &__form {
    ///
  }
}
</style>
