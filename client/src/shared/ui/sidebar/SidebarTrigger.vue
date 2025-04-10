<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { PanelLeft } from 'lucide-vue-next'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <PanelLeft
    data-sidebar="trigger"
    variant="ghost"
    class="icon"
    @click="toggleSidebar"
  />
</template>

<style lang="scss" scoped>
.icon {
  position: absolute;
  top: 0.5rem;
  left: 15rem;
  z-index: 999;
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
