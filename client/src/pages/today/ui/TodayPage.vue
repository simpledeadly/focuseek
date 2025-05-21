<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { Separator } from '@/shared/ui/separator'
import { getStartOfTodayMillis } from '@/shared/lib/utils'
import { AddItemFormInline } from '@/features/item/add'
import { ItemList, useItemList } from '@/widgets/item-list'
import { TabBar } from '@/widgets/tabbar'
import draggable from 'vuedraggable'

const {
  sortedItems,
  activeKey,
  collectionId,
  filteredItems,
  dateFilter,
  itemType,
  collections,
  isHideDone,
  showAllParams,
  isTimeTracking,
  nestedItemsMap,
  updateItemProperty,
  onDragStart,
  onDragEnd,
  addItem,
  removeItem,
  toggleShowSubItems,
  findIdByCollectionTitle,
  hasSubItems,
  deleteTimer,
  openDetailsPage,
  filterNestedItems,
} = useItemList()

const updateFilters = (type: string) => {
  if (type === 'todo') {
    dateFilter.value = 'today'
    collectionId.value = null
  } else {
    dateFilter.value = 'all'
    collectionId.value = 9
  }
}

updateFilters(itemType.value)

watch(itemType, (newVal) => {
  updateFilters(newVal)
})

onUnmounted(() => {
  dateFilter.value = 'all'
})
</script>

<template>
  <div class="today-page item-list">
    <TabBar />
    <Separator
      :label="
        itemType === 'todo' &&
        !isHideDone &&
        !!sortedItems.filter((i) => i.type === itemType).length
          ? `${Math.ceil((sortedItems.filter((i) => i.isDone).length / sortedItems.length) * 100)}% of ${sortedItems.length} (${sortedItems.filter((i) => i.isDone).length})`
          : `${sortedItems.filter((i) => i.type === itemType).length} ${itemType}s`
      "
      class="mb-4"
    />
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
              findIdByCollectionTitle('Today') || 9,
              $event.itemTitle,
              itemType,
              $event.parentId,
              $event.description,
              $event.deadline,
              $event.date ? $event.date : itemType === 'todo' ? getStartOfTodayMillis() : undefined,
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
.today-page {
  /** keep */
}
</style>
