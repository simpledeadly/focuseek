<script setup lang="ts">
import { ItemEntity, useItems, filterNestedItems, ItemType, Item } from '@/entities/item'
import { AddItemFormInline, useAddItem } from '@/features/item/add'
import { ItemTitle, useChangeItemTitle } from '@/features/item/change-title'
import { ItemDescription, useChangeItemDescription } from '@/features/item/change-description'
import { ItemDeadline, useChangeItemDeadline } from '@/features/item/change-deadline'
import { ItemPriority, useChangeItemPriority } from '@/features/item/change-priority'
import { ItemDate, useChangeItemDate } from '@/features/item/change-date'
import { ItemCheckbox, useDoneItem } from '@/features/item/done'
import { useFilterItems } from '@/features/item/filter'
import { useRemoveItem } from '@/features/item/remove'
import { ItemSubItemsToggle, useShowSubItems } from '@/features/item/show-sub-items'
import { ItemOptions } from '@/features/item/options'
import { Collection, useCollections } from '@/entities/collection'
import { useSwitchItemCollection } from '@/features/item/switch-collection'
import { useSwitchItemType } from '@/features/item/switch-type'
import { ItemTimeTrack, useItemTimeTrack } from '@/features/item/time-track'
import ItemSubList from './ItemSubList.vue'

const { items } = useItems()
const { itemType, filteredItems, collectionId } = useFilterItems(items)
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

const { collections } = useCollections()
const { switchItemCollection } = useSwitchItemCollection(items)

defineProps<{
  index: number
  item: Item
  filteredItems: Item[]
  collections: Collection[]
  itemType: ItemType
  showAllParams: boolean
  isTimeTracking: boolean
  filterNestedItems: Item[]
  openDetailsPage: (item: Item) => void
}>()
</script>

<template>
  <ItemEntity
    :showParams="
      !item.isDone &&
      !!(
        item.date ||
        item.deadline ||
        item.durationPlanned ||
        item.durationReal !== null ||
        showAllParams
      )
    "
  >
    <template
      #subItemsToggle
      v-if="hasSubItems(item.id) || item.showSubItems"
    >
      <ItemSubItemsToggle
        :model-value="item.showSubItems"
        @update:model-value="toggleShowSubItems(item)"
      />
    </template>
    <template
      v-if="itemType !== 'note'"
      #checkbox
    >
      <ItemCheckbox
        :priority="item.priority"
        :model-value="item.isDone"
        @update:model-value="toggleDoneItem(item)"
      />
    </template>
    <template #title>
      <ItemTitle
        :is-done="item.isDone"
        :title="item.title"
        @save="changeItemTitle(item, $event)"
      />
    </template>
    <template
      v-if="item.description !== null"
      #description
    >
      <ItemDescription
        :description="item.description"
        @save="changeItemDescription(item, $event)"
      />
    </template>
    <template
      v-if="item.durationReal !== null || item.durationPlanned"
      #timeTrack
    >
      <ItemTimeTrack
        :item="item"
        :model-value="isTimeTracking"
        @change-duration-planned="changeItemDurationPlanned(item, $event)"
        @change-duration-real="changeItemDurationReal(item, $event)"
        @change-duration-real-from-options="deleteTimer(item, $event)"
      />
    </template>
    <template
      v-if="showAllParams || item.date"
      #date
    >
      <ItemDate
        :model-value="item.date"
        @change="changeItemDate(item, $event)"
      />
    </template>
    <template
      v-if="showAllParams || item.deadline"
      #deadline
    >
      <ItemDeadline
        :model-value="item.deadline"
        @change="changeItemDeadline(item, $event)"
      />
    </template>
    <template
      v-if="showAllParams || item.priority"
      #priority
    >
      <ItemPriority
        :model-value="item.priority"
        @update:model-value="changeItemPriority(item, $event)"
      />
    </template>
    <template #options>
      <ItemOptions
        :item="item"
        :collections="collections"
        :hasSubItems="hasSubItems(item.id)"
        :model-value:collectionId="item.collectionId"
        @change-collection="switchItemCollection(item, $event)"
        @change-type="switchItemType(item, item.type === 'todo' ? 'note' : 'todo')"
        @remove="removeItem(item)"
        @add-description="changeItemDescription(item, '')"
        @remove-description="changeItemDescription(item, null)"
        :model-value:date="item.date"
        @edit-date="changeItemDate(item, $event)"
        :model-value:deadline="item.deadline"
        @edit-deadline="changeItemDeadline(item, $event)"
        :model-value:priority="item.priority"
        @edit-priority="changeItemPriority(item, $event)"
        @change-duration-planned="changeItemDurationPlanned(item, $event)"
        @change-duration-real="changeItemDurationReal(item, $event)"
        @change-duration-real-from-opitons="deleteTimer(item, $event)"
        @open-details-page="openDetailsPage(item)"
        @toggle-sub-item-form="toggleShowSubItems(item)"
      />
    </template>
    <template #subItems>
      <TransitionGroup name="sub-fade">
        <div
          v-if="item.showSubItems"
          class="sub-items-container"
        >
          <div
            v-for="(subItem, index) in filterNestedItems(filteredItems, item.id)"
            :key="subItem.id"
            :style="`--index: ${index};`"
            class="sub-item"
          >
            <ItemSubList
              :index="index"
              :item="subItem"
              :filtered-items="filteredItems"
              :collections="collections"
              :item-type="itemType"
              :show-all-params="showAllParams"
              :is-time-tracking="isTimeTracking"
              :has-sub-items="hasSubItems"
              :filter-nested-items="filterNestedItems"
              @toggle-done="$emit('toggle-done', ...arguments)"
              @change-title="$emit('change-title', ...arguments)"
              @change-description="$emit('change-description', ...arguments)"
              @change-duration-planned="$emit('change-duration-planned', ...arguments)"
              @change-duration-real="$emit('change-duration-real', ...arguments)"
              @delete-timer="$emit('delete-timer', ...arguments)"
              @change-date="$emit('change-date', ...arguments)"
              @change-deadline="$emit('change-deadline', ...arguments)"
              @change-priority="$emit('change-priority', ...arguments)"
              @switch-collection="$emit('switch-collection', ...arguments)"
              @switch-type="$emit('switch-type', ...arguments)"
              @remove="$emit('remove', ...arguments)"
              @toggle-show-sub-items="$emit('toggle-show-sub-items', ...arguments)"
              @add-description="$emit('add-description', ...arguments)"
              @remove-description="$emit('remove-description', ...arguments)"
              @open-details-page="$emit('open-details-page', ...arguments)"
            />
          </div>
          <AddItemFormInline
            v-if="item.showSubItems"
            v-model:type="itemType"
            key="add-item-form"
            @submit="
              addItem(
                collectionId,
                $event.itemTitle,
                itemType,
                item.id,
                $event.description,
                $event.deadline,
                $event.date,
                $event.priority,
                $event.durationPlanned
              )
            "
          >
          </AddItemFormInline>
        </div>
      </TransitionGroup>
    </template>
  </ItemEntity>
</template>

<style lang="scss">
// .item {
//   transition:
//     opacity 0.5s cubic-bezier(0.55, 0, 0.1, 1),
//     transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
//   transition-delay: calc(0.05s * var(--index));
// }

.sub-items-container {
  max-height: 3000px; /* Достаточно большой для подэлементов */
  transition:
    max-height 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
}

.sub-fade-enter-active,
.sub-fade-leave-active {
  transition:
    max-height 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
}

.sub-fade-enter-from,
.sub-fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.sub-item {
  transition:
    opacity 0.2s cubic-bezier(0.55, 0, 0.1, 1),
    transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);
  transition-delay: calc(0.01s * var(--index));
}

.sub-fade-enter-from .sub-item,
.sub-fade-leave-to .sub-item {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
