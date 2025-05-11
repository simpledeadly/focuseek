<script setup lang="ts">
import { Search } from '@/widgets/search'
import { AddItemFormInline } from '@/features/item/add'
import { useItemList, ItemList } from '..'
import { useSidebar } from '@/shared/ui/sidebar'
import draggable from 'vuedraggable'

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
  nestedItemsMap,
} = useItemList()

const { isMobile } = useSidebar()
</script>

<template>
  <Search />
  <div class="flex mb-4">
    <select v-model="dateFilter">
      <option value="all">Все даты</option>
      <option value="today">Только сегодня</option>
    </select>
    <select v-model="priorityFilter">
      <option :value="0">All</option>
      <option :value="1">High</option>
      <option :value="2">Medium</option>
      <option :value="3">Low</option>
      <option :value="null">Only gray</option>
    </select>
  </div>
  <div class="flex mb-4">
    <select v-model="sortBy">
      <option value="default">Без сортировки</option>
      <option value="date">По дате</option>
      <option value="priority">По приоритету</option>
    </select>

    <select v-model="sortOrder">
      <option value="asc">По возрастанию</option>
      <option value="desc">По убыванию</option>
    </select>
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
