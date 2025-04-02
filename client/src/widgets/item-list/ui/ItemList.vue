<script setup lang="ts">
import { ItemEntity, useItems, filterNestedItems } from '@/entities/item'
import { AddItemForm, useAddItem } from '@/features/item/add'
import { useChangeItemDeadline } from '@/features/item/change-deadline'
import { ItemTitle, useChangeItemTitle } from '@/features/item/change-title'
import { Deadline } from '@/features/item/change-deadline'
import { ItemCheckbox, useDoneItem } from '@/features/item/done'
import { ItemTypeSelect, useFilterItems } from '@/features/item/filter'
import { ItemRemoveButton, useRemoveItem } from '@/features/item/remove'

import { Checkbox } from '@/shared/ui/checkbox'
import { StickyNote } from 'lucide-vue-next'
import { useShowSubItems } from '@/features/item/show-sub-items'
import AddItemFormInline from '@/features/item/add/ui/AddItemFormInline.vue'

const { items } = useItems()
const { itemType, filteredItems, filteredParentItems, collectionId } = useFilterItems(items)
const { addItem } = useAddItem(items)
const { removeItem } = useRemoveItem(items)
const { toggleDoneItem } = useDoneItem(items)
const { toggleShowSubItems, hasSubItems } = useShowSubItems(items)
const { changeItemTitle } = useChangeItemTitle(items)
const { changeItemDeadline } = useChangeItemDeadline(items)
</script>

<template>
  <AddItemForm
    v-model:type="itemType"
    @submit="addItem(collectionId, $event.itemTitle, itemType, $event.parentId)"
  >
    <template #select>
      <ItemTypeSelect v-model="itemType" />
    </template>
  </AddItemForm>

  <div
    v-if="filteredParentItems.length > 0"
    class="item-list"
  >
    <TransitionGroup name="fade">
      <ItemEntity
        v-for="item in filteredParentItems"
        :key="item.id"
      >
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
          <!-- <p v-if="item.description" style="color: hsl(var(--muted-foreground))">{{ item.description }}</p> -->
        </template>
        <template
          #showSubItemsToggle
          v-if="hasSubItems(item.id)"
        >
          <Checkbox
            v-model="item.showSubItems"
            @click="toggleShowSubItems(item)"
          />
        </template>
        <template
          v-if="itemType !== 'note' && !item.isDone"
          #timeLeft
        >
          <Deadline
            :deadline="item.deadline"
            @change="changeItemDeadline(item, $event)"
          />
        </template>
        <template #removeButton>
          <ItemRemoveButton
            :item="item"
            @remove="removeItem(item)"
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
            <template
              v-if="itemType !== 'note' && !subItem.isDone"
              #timeLeft
            >
              <Deadline
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
                  <Deadline
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
    </TransitionGroup>
    
    <AddItemFormInline
      v-model:type="itemType"
      @submit="addItem(collectionId, $event.itemTitle, itemType, $event.parentId)"
    >
      <template #select>
        <ItemTypeSelect v-model="itemType" />
      </template>
    </AddItemFormInline>
  </div>
  <div
    v-else
    class="empty"
  >
    <StickyNote :size="40" />
    <strong class="empty__message">No {{ itemType }}s</strong>
  </div>
</template>

<style lang="scss">
.item-list {
  width: 70vw;
  margin-bottom: 5rem;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  color: #acacac;

  &__message {
    margin-top: 0.5rem;
    font-size: 20px;
  }
}

.pagination {
  opacity: 0;
  transition: all 0.1s;

  &:hover {
    opacity: 1;
  }
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>
