<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Toggle } from '@/shared/ui/toggle'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { useItemList } from '@/widgets/item-list'
import { Settings2 } from 'lucide-vue-next'
import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'

const { dateFilter, priorityFilter, sortBy, sortOrder, isHideDone } = useItemList()
</script>

<template>
  <Popover class="collection-options">
    <PopoverTrigger>
      <Toggle>
        <Settings2 class="w-4 h-4" />
      </Toggle>
    </PopoverTrigger>
    <PopoverContent>
      <div class="flex mb-2">
        <Select v-model="dateFilter">
          <SelectTrigger
            arrow
            class="w-[180px]"
          >
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          :modelValue="priorityFilter?.toString()"
          @update:modelValue="
            (value) =>
              value === 'null' ? (priorityFilter = null) : (priorityFilter = Number(value))
          "
        >
          <SelectTrigger
            arrow
            class="w-[180px] ml-2"
          >
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">All</SelectItem>
              <SelectItem value="1">High</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">Low</SelectItem>
              <SelectItem value="null">Only grays</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="flex mb-4">
        <Select v-model="sortBy">
          <SelectTrigger
            arrow
            class="w-[180px]"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="default">No sorting</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select v-model="sortOrder">
          <SelectTrigger
            arrow
            class="w-[180px] ml-2"
          >
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center justify-between">
        <Label for="hide-done">Hide done items</Label>
        <Switch
          id="hide-done"
          v-model="isHideDone"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>

<style lang="scss">
.collection-options {
  /** keep */
}
</style>
