<script setup lang="ts">
import { ref } from 'vue'
import { ItemEntity, useItems, filterNestedItems } from '@/entities/item'
import { AddItemFormInline, useAddItem } from '@/features/item/add'
import { ItemTitle, useChangeItemTitle } from '@/features/item/change-title'
import { ItemDescription, useChangeItemDescription } from '@/features/item/change-description'
import { ItemDeadline, useChangeItemDeadline } from '@/features/item/change-deadline'
import { ItemPriority, useChangeItemPriority } from '@/features/item/change-priority'
import { ItemDate, useChangeItemDate } from '@/features/item/change-date'
import { ItemCheckbox, useDoneItem } from '@/features/item/done'
import { useFilterItems } from '@/features/item/filter'
import { ItemRemoveButton, useRemoveItem } from '@/features/item/remove'
import { ItemSubItemsToggle, useShowSubItems } from '@/features/item/show-sub-items'
import { ItemOptions } from '@/features/item/options'
import { useCollections } from '@/entities/collection'
import { useSwitchItemCollection } from '@/features/item/switch-collection'
import { useSwitchItemType } from '@/features/item/switch-type'
import { ItemTimeTrack, useItemTimeTrack } from '@/features/item/time-track'
import { Search } from '@/widgets/search'

const { items } = useItems()
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

const { collections } = useCollections()
const { switchItemCollection } = useSwitchItemCollection(items)

const showAllParams = ref<boolean>(false)
const isTimeTracking = ref<boolean>(false)
</script>

<template>
  <Search />
  <div class="item-list">
    <TransitionGroup name="fade">
      <ItemEntity
        v-for="item in filteredParentItems"
        :key="item.id"
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
          v-if="hasSubItems(item.id)"
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
          #timeLeft
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
          />
        </template>
        <template
          #subItems
          v-if="item.showSubItems"
        >
          <ItemEntity
            v-for="subItem in filterNestedItems(filteredItems, item.id)"
            :key="subItem.id"
          >
            <template
              v-if="itemType !== 'note'"
              #checkbox
            >
              <ItemCheckbox
                :model-value="subItem.isDone"
                @update:model-value="toggleDoneItem(subItem)"
              />
            </template>
            <template #title>
              <ItemTitle
                :is-done="subItem.isDone"
                :title="subItem.title"
                @save="changeItemTitle(subItem, $event)"
              />
            </template>
            <template
              #showSubItemsToggle
              v-if="hasSubItems(subItem.id)"
            >
              <Checkbox
                v-model="subItem.showSubItems"
                @click="toggleShowSubItems(subItem)"
              />
            </template>
            <template #timeLeft>
              <ItemDeadline
                :deadline="subItem.deadline"
                @change="changeItemDeadline(subItem, $event)"
              />
            </template>
            <template #removeButton>
              <ItemRemoveButton
                :item="subItem"
                @remove="removeItem(subItem)"
              />
            </template>
            <template
              #subItems
              v-if="subItem.showSubItems"
            >
              <ItemEntity
                v-for="subItem2 in filterNestedItems(filteredItems, subItem.id)"
                :key="subItem2.id"
              >
                <template
                  v-if="itemType !== 'note'"
                  #checkbox
                >
                  <ItemCheckbox
                    :model-value="subItem2.isDone"
                    @update:model-value="toggleDoneItem(subItem2)"
                  />
                </template>
                <template #title>
                  <ItemTitle
                    :is-done="subItem2.isDone"
                    :title="subItem2.title"
                    @save="changeItemTitle(subItem2, $event)"
                  />
                </template>
                <template
                  v-if="itemType !== 'note' && !subItem2.isDone"
                  #timeLeft
                >
                  <ItemDeadline
                    :deadline="subItem2.deadline"
                    @change="changeItemDeadline(subItem2, $event)"
                  />
                </template>
                <template #removeButton>
                  <ItemRemoveButton
                    :item="subItem2"
                    @remove="removeItem(subItem2)"
                  />
                </template>
              </ItemEntity>
            </template>
          </ItemEntity>
        </template>
      </ItemEntity>
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
  <!-- <div
    v-if="filteredParentItems.length === 0"
    class="empty"
  >
    <StickyNote :size="60" />
    <div class="empty__message">
      <b>No {{ itemType }}s</b>
      <p class="text-sm text-muted-foreground mt-1">
        Press
        <kbd
          class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        >
          <span class="text-xs">⌘</span>J
        </kbd>
        to show form
      </p>
    </div>
  </div> -->
</template>

<style lang="scss">
.item-list {
  width: 70vw;
  margin-bottom: 4rem;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  color: #acacac;
  height: 50vh;

  &__message {
    margin-top: 0.5rem;
    font-size: 24px;
  }
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.1s cubic-bezier(0.55, 0, 0.1, 1),
    transform 0.1s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-active {
  position: absolute;
  width: 100%;
}
</style>
