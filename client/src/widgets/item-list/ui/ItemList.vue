<script setup lang="ts">
import { ItemEntity, useItems } from '@/entities/item'
import { AddItemForm, useAddItem } from '@/features/item/add'
import { ItemTitle, useChangeItemTitle } from '@/features/item/change-title'
import { TypeSelect, useChangeItemType } from '@/features/item/change-type'
import { ItemCheckbox, useDoneItem } from '@/features/item/done'
import { ItemTypeSelect, useFilterItems } from '@/features/item/filter'
import { ItemRemoveButton, useRemoveItem } from '@/features/item/remove'
import { ProjectDrawer } from '@/widgets/projects-drawer'
import { StickyNote } from 'lucide-vue-next'
// import { watch } from 'vue'

const { items } = useItems()
const { itemType, filteredItems } = useFilterItems(items)
const { addItem } = useAddItem(items)
const { removeItem } = useRemoveItem(items)
const { toggleDoneItem } = useDoneItem(items)
const { changeItemTitle } = useChangeItemTitle(items)
const { changeItemType } = useChangeItemType(items)

// watch(items, () => console.log(items.value))
// watch(filteredItems, () => console.log(filteredItems.value))
</script>

<template>
  <AddItemForm
    v-model:type="itemType"
    @submit="addItem($event, itemType)"
  >
    <template #select>
      <ItemTypeSelect v-model="itemType" />
    </template>
  </AddItemForm>
  <div
    v-if="filteredItems.length > 0"
    class="item-list"
  >
    <TransitionGroup name="fade">
      <ItemEntity
        v-for="item in filteredItems"
        :key="item.id"
        :type="item.type"
      >
        <template
          v-if="itemType !== 'note'"
          #checkbox
        >
          <ItemCheckbox
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
        <template #removeButton>
          <!-- <ItemRemoveButton @remove="removeItem(item)" /> -->
          <ItemRemoveButton
            :item="item"
            @remove="removeItem(item)"
          />
        </template>
        <template
          v-if="item.type === 'project'"
          #showSubtodosToggle
        >
          <ProjectDrawer>
            <template #title>
              <ItemTitle
                :is-done="item.isDone"
                :title="item.title"
                @save="changeItemTitle(item, $event)"
              />
            </template>
            <template #form>
              <AddItemForm
                v-model:type="itemType"
                @submit="addItem($event, itemType)"
              >
                <template #select>
                  <ItemTypeSelect v-model="itemType" />
                </template>
              </AddItemForm>
            </template>
            <template #stats>
              {{ item.subtodos!.filter((item) => item.type === 'todo').length }} todos,
              {{ item.subtodos!.filter((item) => item.type === 'note').length }} notes
            </template>
            <template #content>
              <div class="mt-2">
                <strong>Todos</strong>
                <p
                  v-for="subitem in item.subtodos!.filter((item) => item.type === 'todo')"
                  :key="subitem.id"
                >
                  {{ subitem.title }}
                </p>
              </div>
              <!-- <Separator class="mt-4 mb-2" /> -->
              <div class="mt-4 mb-2">
                <strong>Notes</strong>
                <p
                  v-for="subitem in item.subtodos!.filter((item) => item.type === 'note')"
                  :key="subitem.id"
                >
                  {{ subitem.title }}
                </p>
              </div>
            </template>
          </ProjectDrawer>
        </template>
        <template #typeSelect>
          <TypeSelect
            :model-value="item.type"
            @update:model-value="changeItemType(item, $event!)"
          />
        </template>
      </ItemEntity>
    </TransitionGroup>
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
  min-width: 350px;
  max-width: 60% or 1024px;
}

.empty {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #acacac;

  &__message {
    margin-top: 0.5rem;
    font-size: 20px;
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
