<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/shared/ui/select'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'

const model = defineModel<number>()
</script>

<template>
  <div class="item-priority">
    <Select v-model="model">
      <SelectTrigger badge>
        <Badge
          :variant="model ? 'secondary' : 'outline'"
          :class="cn('flex justify-start text-left font-normal', !model && 'text-muted-foreground')"
        >
          {{ model ? model : 'Set priority' }}
        </Badge>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem :value="1">High</SelectItem>
          <SelectItem :value="2">Medium</SelectItem>
          <SelectItem :value="3">Low</SelectItem>
          <SelectItem :value="0">Clear</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<style lang="scss">
.item-priority {
  display: flex;
  cursor: pointer;
  color: hsl(var(--muted-foreground));
  font-weight: normal;
}
</style>
