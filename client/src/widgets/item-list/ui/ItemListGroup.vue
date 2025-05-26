<script setup lang="ts">
import { useSidebar } from '@/shared/ui/sidebar'
import { Separator } from '@/shared/ui/separator'
import { AddItemFormInline } from '@/features/item/add'
import { useItemList, ItemList } from '..'

const {
  sortedItems,
  activeKey,
  isHideDone,
  filteredItems,
  itemType,
  collections,
  collectionId,
  showAllParams,
  isTimeTracking,
  updateItemProperty,
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
  <div
    class="item-list"
    :style="isMobile && 'width: 85vw'"
  >
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
    <Transition name="fade">
      <div :key="activeKey">
        <TransitionGroup name="fade-list">
          <div
            v-for="item in sortedItems"
            :key="item.id"
          >
            <ItemList
              :item="item"
              :filtered-items="filteredItems"
              :collections="collections"
              :item-type="itemType"
              :show-all-params="showAllParams"
              :is-time-tracking="isTimeTracking"
              :has-sub-items="hasSubItems"
              :filter-nested-items="filterNestedItems"
              :openDetailsPage="openDetailsPage"
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
          <AddItemFormInline
            v-model:type="itemType"
            key="add-item-form"
            @submit="
              addItem(
                collectionId ?? 0,
                $event.itemTitle,
                itemType,
                $event.parentId,
                $event.description,
                $event.deadline,
                $event.date,
                $event.priority,
                $event.durationPlanned,
                $event.tags
              )
            "
          >
          </AddItemFormInline>
        </TransitionGroup>
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
