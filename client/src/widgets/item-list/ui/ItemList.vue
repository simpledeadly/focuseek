<script setup lang="ts">
import { AddItemFormInline } from '@/features/item/add'
import { useItemList, ItemSubList } from '../'

const {
  itemType,
  filteredItems,
  filteredParentItems,
  collectionId,
  addItem,
  removeItem,
  toggleDoneItem,
  toggleShowSubItems,
  hasSubItems,
  changeItemTitle,
  changeItemDescription,
  changeItemDeadline,
  changeItemDate,
  changeItemPriority,
  switchItemType,
  changeItemDurationPlanned,
  changeItemDurationReal,
  deleteTimer,
  collections,
  switchItemCollection,
  showAllParams,
  isTimeTracking,
  activeKey,
  openDetailsPage,
  filterNestedItems,
} = useItemList()
</script>

<template>
  <Search />
  <div class="item-list">
    <Transition
      name="fade"
      mode="default"
    >
      <div :key="activeKey">
        <TransitionGroup name="fade-list">
          <div
            v-for="(item, index) in filteredParentItems"
            :key="item.id"
          >
            <ItemSubList
              :index="index"
              :item="item"
              :filtered-items="filteredItems"
              :collections="collections"
              :item-type="itemType"
              :show-all-params="showAllParams"
              :is-time-tracking="isTimeTracking"
              :has-sub-items="hasSubItems"
              :filter-nested-items="filterNestedItems"
              :openDetailsPage="openDetailsPage"
              @toggle-done="toggleDoneItem"
              @change-title="changeItemTitle"
              @change-description="changeItemDescription"
              @change-duration-planned="changeItemDurationPlanned"
              @change-duration-real="changeItemDurationReal"
              @delete-timer="deleteTimer"
              @change-date="changeItemDate"
              @change-deadline="changeItemDeadline"
              @change-priority="changeItemPriority"
              @switch-collection="switchItemCollection"
              @switch-type="switchItemType"
              @remove="removeItem"
              @toggle-show-sub-items="toggleShowSubItems"
              @add-description="changeItemDescription"
              @remove-description="changeItemDescription"
              @open-details-page="openDetailsPage"
            />
          </div>
          <AddItemFormInline
            v-model:type="itemType"
            key="add-item-form"
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
