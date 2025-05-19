<script setup lang="ts">
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { ChevronLeft } from 'lucide-vue-next'
import { PaginationPrev, type PaginationPrevProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<PaginationPrevProps & { class?: HTMLAttributes['class'] }>(),
  {
    asChild: true,
  }
)

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationPrev v-bind="delegatedProps">
    <Button
      :class="cn('w-8 h-8 p-0', props.class)"
      variant="ghost"
    >
      <slot>
        <ChevronLeft class="w-4 h-4" />
      </slot>
    </Button>
  </PaginationPrev>
</template>
