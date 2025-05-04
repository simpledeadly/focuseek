<script setup lang="ts">
import { computed, ref } from 'vue'
import { useItems, filterNestedItems, Item } from '@/entities/item'
import { AddItemFormInline, useAddItem } from '@/features/item/add'
import { useChangeItemTitle } from '@/features/item/change-title'
import { useChangeItemDescription } from '@/features/item/change-description'
import { useChangeItemDeadline } from '@/features/item/change-deadline'
import { useChangeItemPriority } from '@/features/item/change-priority'
import { useChangeItemDate } from '@/features/item/change-date'
import { useDoneItem } from '@/features/item/done'
import { useFilterItems } from '@/features/item/filter'
import { useRemoveItem } from '@/features/item/remove'
import { useShowSubItems } from '@/features/item/show-sub-items'
import { useCollections } from '@/entities/collection'
import { useSwitchItemCollection } from '@/features/item/switch-collection'
import { useSwitchItemType } from '@/features/item/switch-type'
import { useItemTimeTrack } from '@/features/item/time-track'
import { Search } from '@/widgets/search'
import { router } from '@/app/router/router'
import ItemSubList from './ItemSubList.vue'

const { items, setSelectedItem } = useItems()
const { itemType, filteredItems, filteredParentItems, collectionId } = useFilterItems(items)
const { addItem } = useAddItem(items)
const { removeItem } = useRemoveItem(items)
const { toggleDoneItem } = useDoneItem(items)
const { toggleShowSubItems, hasSubItems } = useShowSubItems(items)
const { changeItemTitle } = useChangeItemTitle(items)
const { changeItemDescription } = useChangeItemDescription(items)
const { changeItemDeadline } = useChangeItemDeadline(items)
const { changeItemDate } = useChangeItemDate(items)
const { changeItemPriority } = useChangeItemPriority(items)
const { switchItemType } = useSwitchItemType(items)
const { changeItemDurationPlanned, changeItemDurationReal, deleteTimer } = useItemTimeTrack(items)

const { collections, findCollectionTitleById } = useCollections()
const { switchItemCollection } = useSwitchItemCollection(items)

const showAllParams = ref<boolean>(false)
const isTimeTracking = ref<boolean>(false)

const activeKey = computed(() => {
  const colId = collectionId.value != null && collectionId.value
  const type = itemType.value
  return `${colId}__${type}`
})

const openDetailsPage = (item: Item) => {
  setSelectedItem(item)
  router.push({
    path: `/${findCollectionTitleById(item.collectionId).toLowerCase()}/${item.id}`,
  })
}
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
            :style="`--index: ${index};`"
            class="item"
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
