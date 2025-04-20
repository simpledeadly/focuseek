<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'

const model = defineModel<number>()
</script>

<template>
  <div class="item-priority">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Badge
          :variant="model ? 'secondary' : 'outline'"
          :class="
            cn('flex justify-start text-left font-normal', !model && 'text-muted-foreground')
          "
        >
          {{ model ? model : 'Priority' }}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          :modelValue="model?.toString()"
          @update:modelValue="(value) => (model = Number(value))"
        >
          <DropdownMenuRadioItem value="1">High</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="2">Medium</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="3">Low</DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value="0">No priority</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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
