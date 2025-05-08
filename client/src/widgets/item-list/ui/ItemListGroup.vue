<script setup lang="ts">
import { Search } from '@/widgets/search'
import { AddItemFormInline } from '@/features/item/add'
import { useItemList, ItemList } from '..'

const {
  activeKey,
  filteredItems,
  filteredParentItems,
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
            <ItemList
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
