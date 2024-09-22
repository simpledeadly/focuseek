<script setup lang="ts">
import type { ItemType } from '@/entities/item'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

const model = defineModel<ItemType>()
</script>

<template>
  <Select
    v-model="model"
    class="item-type-select"
  >
    <SelectTrigger
      arrow
      class="w-[180px] item-type-select__content"
    >
      <SelectValue placeholder="Type" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <!-- <SelectLabel> Types </SelectLabel> -->
        <SelectItem
          value="todo"
          class="item-type-select__item"
        >
          Todo
        </SelectItem>
        <SelectItem
          value="material"
          class="item-type-select__item"
        >
          Material
        </SelectItem>
        <SelectItem
          value="project"
          class="item-type-select__item"
        >
          Project
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<style lang="scss">
.item-type-select {
  &__content {
    border-right: none;
    border-left: none;
    border-radius: 0;
  }

  &__item {
    // width: 100%;
  }
}
</style>
