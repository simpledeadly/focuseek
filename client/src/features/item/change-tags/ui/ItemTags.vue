<script setup lang="ts">
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'

const props = defineProps<{
  tags?: string[]
}>()
</script>

<template>
  <div class="item-tags">
    <Badge
      v-for="tag in props.tags"
      :variant="props.tags && props.tags.length > 0 ? 'secondary' : 'outline'"
      :class="cn('justify-start text-left font-normal text-muted-foreground', !props.tags && 'text-muted-foreground')"
    >
      {{ tag }}
    </Badge>
  </div>
</template>

<style lang="scss">
.item-tags {
  display: flex;
  gap: 4px;
}
</style>
