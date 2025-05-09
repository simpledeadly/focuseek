<script setup lang="ts">
import { ItemEntity, Item } from '@/entities/item'
import { AddItemFormInline } from '@/features/item/add'
import { ItemTitle } from '@/features/item/change-title'
import { ItemDescription } from '@/features/item/change-description'
import { ItemDeadline } from '@/features/item/change-deadline'
import { ItemPriority } from '@/features/item/change-priority'
import { ItemDate } from '@/features/item/change-date'
import { ItemCheckbox } from '@/features/item/change-done'
import { ItemSubItemsToggle } from '@/features/item/show-sub-items'
import { ItemOptions } from '@/features/item/options'
import { ItemTimeTrack } from '@/features/item/time-track'
import { useItemList } from '../composable/useItemList'

const {
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
  resetTimer,
  deleteTimer,
  openDetailsPage,
  filterNestedItems,
} = useItemList()

const emit = defineEmits<{
  (e: 'toggle-done', ...args: any[]): void
  (e: 'change-title', ...args: any[]): void
  (e: 'change-description', ...args: any[]): void
  (e: 'change-duration-planned', ...args: any[]): void
  (e: 'change-duration-real', ...args: any[]): void
  (e: 'reset-timer', ...args: any[]): void
  (e: 'delete-timer', ...args: any[]): void
  (e: 'change-date', ...args: any[]): void
  (e: 'change-deadline', ...args: any[]): void
  (e: 'change-priority', ...args: any[]): void
  (e: 'switch-collection', ...args: any[]): void
  (e: 'switch-user', ...args: any[]): void
  (e: 'switch-type', ...args: any[]): void
  (e: 'remove', ...args: any[]): void
  (e: 'toggle-show-sub-items', ...args: any[]): void
  (e: 'add-description', ...args: any[]): void
  (e: 'remove-description', ...args: any[]): void
  (e: 'open-details-page', ...args: any[]): void
}>()

defineProps<{
  index: number
  item: Item
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
        @update:model-value="updateItemProperty(item, { isDone: !item.isDone })"
      />
    </template>
    <template #title>
      <ItemTitle
        :is-done="item.isDone"
        :title="item.title"
        @save="updateItemProperty(item, { title: $event })"
      />
    </template>
    <template
      v-if="item.description !== null"
      #description
    >
      <ItemDescription
        :description="item.description"
        @save="updateItemProperty(item, { description: $event })"
      />
    </template>
    <template
      v-if="item.durationReal !== null || item.durationPlanned"
      #timeTrack
    >
      <ItemTimeTrack
        :item="item"
        :model-value="isTimeTracking"
        @change-duration-planned="updateItemProperty(item, { durationPlanned: $event })"
        @change-duration-real="updateItemProperty(item, { durationReal: $event })"
        @reset-timer="resetTimer(item)"
        @remove-timer="deleteTimer(item)"
      />
    </template>
    <template
      v-if="showAllParams || item.date"
      #date
    >
      <ItemDate
        :model-value="item.date"
        @change="updateItemProperty(item, { date: $event })"
      />
    </template>
    <template
      v-if="showAllParams || item.deadline"
      #deadline
    >
      <ItemDeadline
        :model-value="item.deadline"
        @change="updateItemProperty(item, { deadline: $event })"
      />
    </template>
    <template
      v-if="showAllParams || item.priority"
      #priority
    >
      <ItemPriority
        :model-value="item.priority"
        @update:model-value="updateItemProperty(item, { priority: $event })"
      />
    </template>
    <template #options>
      <ItemOptions
        :item="item"
        :collections="collections"
        :hasSubItems="hasSubItems(item.id)"
        :model-value:collectionId="item.collectionId"
        @switch-collection="
          updateItemProperty(
            item,
            { collectionId: $event, parentItemId: null },
            { withChildren: true }
          )
        "
        @switch-user="
          updateItemProperty(
            item,
            { userId: $event.userId, collectionId: $event.colId, parentItemId: null },
            { withChildren: true }
          )
        "
        @switch-type="
          updateItemProperty(
            item,
            { type: item.type === 'todo' ? 'note' : 'todo', parentItemId: null },
            { withChildren: true }
          )
        "
        @remove="removeItem(item)"
        @add-description="updateItemProperty(item, { description: '' })"
        @remove-description="updateItemProperty(item, { description: null })"
        :model-value:date="item.date"
        @change-date="updateItemProperty(item, { date: $event })"
        :model-value:deadline="item.deadline"
        @change-deadline="updateItemProperty(item, { deadline: $event })"
        :model-value:priority="item.priority"
        @change-priority="updateItemProperty(item, { priority: $event })"
        @change-duration-planned="updateItemProperty(item, { durationPlanned: $event })"
        @reset-timer="resetTimer(item)"
        @remove-timer="deleteTimer(item)"
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
            <ItemList
              :index="index"
              :item="subItem"
              :filtered-items="filteredItems"
              :collections="collections"
              :item-type="itemType"
              :show-all-params="showAllParams"
              :is-time-tracking="isTimeTracking"
              :has-sub-items="hasSubItems"
              :filter-nested-items="filterNestedItems"
              @toggle-done="(...args: any) => emit('toggle-done', ...args)"
              @change-title="(...args: any) => emit('change-title', ...args)"
              @change-description="(...args: any) => emit('change-description', ...args)"
              @change-duration-planned="(...args: any) => emit('change-duration-planned', ...args)"
              @change-duration-real="(...args: any) => emit('change-duration-real', ...args)"
              @delete-timer="(...args: any) => emit('delete-timer', ...args)"
              @change-date="(...args: any) => emit('change-date', ...args)"
              @change-deadline="(...args: any) => emit('change-deadline', ...args)"
              @change-priority="(...args: any) => emit('change-priority', ...args)"
              @switch-collection="(...args: any) => emit('switch-collection', ...args)"
              @switch-user="(...args: any) => emit('switch-user', ...args)"
              @switch-type="(...args: any) => emit('switch-type', ...args)"
              @remove="(...args: any) => emit('remove', ...args)"
              @toggle-show-sub-items="(...args: any) => emit('toggle-show-sub-items', ...args)"
              @add-description="(...args: any) => emit('add-description', ...args)"
              @remove-description="(...args: any) => emit('remove-description', ...args)"
              @open-details-page="(...args: any) => emit('open-details-page', ...args)"
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
.sub-items-container {
  max-height: 3000px;
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
