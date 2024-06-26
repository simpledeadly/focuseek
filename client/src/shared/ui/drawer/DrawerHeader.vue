<script lang="ts" setup>
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '@/src/shared/lib'

const props = defineProps<{
  class?: HtmlHTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('grid gap-1.5 p-4 text-center sm:text-left', props.class)">
    <slot />
  </div>
</template>
