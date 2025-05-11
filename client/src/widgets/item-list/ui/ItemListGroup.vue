<script setup lang="ts">
import draggable from 'vuedraggable'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useSidebar } from '@/shared/ui/sidebar'
import { AddItemFormInline } from '@/features/item/add'
import { Search } from '@/widgets/search'
import { HideToggle } from '@/widgets/hide-toggle'
import { useItemList, ItemList } from '..'

const {
  sortedItems,
  activeKey,
  filteredItems,
  itemType,
  collections,
  collectionId,
  showAllParams,
  isTimeTracking,
  dateFilter,
  priorityFilter,
  sortBy,
  sortOrder,
  isHideDone,
  nestedItemsMap,
  updateItemProperty,
  onDragStart,
  onDragEnd,
  // onAddToRoot,
  // onRemoveFromRoot,
  addItem,
  removeItem,
  toggleShowSubItems,
  hasSubItems,
  deleteTimer,
  openDetailsPage,
  filterNestedItems,
} = useItemList()

const { isMobile } = useSidebar()
</script>

<template>
  <Search />
  <div class="flex mb-2">
    <Select v-model="dateFilter">
      <SelectTrigger
        arrow
        class="w-[180px]"
      >
        <SelectValue placeholder="Select a date" />
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
        (value) => (value === 'null' ? (priorityFilter = null) : (priorityFilter = Number(value)))
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
    <HideToggle
      class="ml-2"
      v-model="isHideDone"
    />
  </div>
  <div class="flex mb-2">
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
  <div
    class="item-list"
    :style="isMobile && 'width: 85vw'"
  >
    <Transition
      name="fade"
      mode="default"
    >
      <div :key="activeKey">
        <draggable
          item-key="id"
          v-model="sortedItems"
          :group="{ name: 'items', pull: true, put: true }"
          @start="onDragStart"
          @end="onDragEnd"
          :component-data="{ name: 'fade-list', type: 'transition-group' }"
          :animation="150"
        >
          <template #item="{ element }">
            <div :data-id="element.id">
              <ItemList
                :item="element"
                :filtered-items="filteredItems"
                :collections="collections"
                :item-type="itemType"
                :show-all-params="showAllParams"
                :is-time-tracking="isTimeTracking"
                :has-sub-items="hasSubItems"
                :filter-nested-items="filterNestedItems"
                :nested-items="nestedItemsMap[element.id] || []"
                @toggle-done="updateItemProperty"
                @change-title="updateItemProperty"
                @change-description="updateItemProperty"
                @change-duration-planned="updateItemProperty"
                @change-duration-real="updateItemProperty"
                @delete-timer="deleteTimer"
                @change-date="updateItemProperty"
                @change-deadline="updateItemProperty"
                @change-priority="updateItemProperty"
                @switch-collection="updateItemProperty"
                @switch-type="updateItemProperty"
                @remove="removeItem"
                @toggle-show-sub-items="toggleShowSubItems"
                @add-description="updateItemProperty"
                @remove-description="updateItemProperty"
                @open-details-page="openDetailsPage"
              />
            </div>
          </template>
        </draggable>
        <AddItemFormInline
          key="add-item-form"
          v-model:type="itemType"
          @submit="
            addItem(
              collectionId,
              $event.itemTitle,
              itemType,
              $event.parentId,
              $event.description,
              $event.deadline,
              $event.date,
              $event.priority,
              $event.durationPlanned
            )
          "
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.item-list {
  width: 70vw;
  margin-bottom: 40rem;
}
</style>
