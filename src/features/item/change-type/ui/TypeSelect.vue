<script setup lang="ts">
import type { ItemType } from '@/entities/item'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

const model = defineModel<ItemType>()
</script>

<template>
  <Select
    v-model="model"
    class="type-select"
  >
    <SelectTrigger class="w-[180px] type-select__content">
      <SelectValue placeholder="Type" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="todo"> T </SelectItem>
        <SelectItem value="note"> N </SelectItem>
        <SelectItem value="project"> P </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<style lang="scss">
.type-select {
  &__content {
    width: 100%;
    height: 100%;
    padding: calc(var(--radius) - 6px) calc(var(--radius) - 2px);
  }
}
</style>
