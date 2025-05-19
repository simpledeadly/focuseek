<script setup lang="ts">
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { ChevronsLeft } from 'lucide-vue-next'
import { PaginationFirst, type PaginationFirstProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<PaginationFirstProps & { class?: HTMLAttributes['class'] }>(),
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
  <PaginationFirst v-bind="delegatedProps">
    <Button
      :class="cn('w-8 h-8 p-0', props.class)"
      variant="ghost"
    >
      <slot>
        <ChevronsLeft class="w-4 h-4" />
      </slot>
    </Button>
  </PaginationFirst>
</template>
