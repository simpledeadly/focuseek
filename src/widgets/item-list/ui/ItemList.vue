<script setup lang="ts">
import { ItemEntity, useItems } from '@/entities/item'
import { AddItemForm, useAddItem } from '@/features/item/add'
import { ItemTitle, useChangeItemTitle } from '@/features/item/change-title'
import { TypeSelect, useChangeItemType } from '@/features/item/change-type'
import { ItemCheckbox, useDoneItem } from '@/features/item/done'
import { ItemTypeSelect, useFilterItems } from '@/features/item/filter'
import { ItemRemoveButton, useRemoveItem } from '@/features/item/remove'
import { ProjectDrawer } from '@/widgets/projects-drawer'

// const props = defineProps<{
// items: Item[]
// items: Array<{ subtodos?: Item[] }>
// }>()

// const slots = defineSlots<{
//   default?: () => unknown
// }>()

const { items } = useItems()
const { itemType, filteredItems } = useFilterItems(items)
const { addItem } = useAddItem(items)
const { removeItem } = useRemoveItem(items)
const { toggleDoneItem } = useDoneItem(items)
const { changeItemTitle } = useChangeItemTitle(items)
const { changeItemType } = useChangeItemType(items)
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
        <ItemRemoveButton @remove="removeItem(item)" />
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
          @update:model-value="changeItemType(item, $event)"
        />
      </template>
      <!-- <div
        v-if="slots.default && showSubtodosToggle && item.subtodos && item.subtodos.length > 0"
        class="item-list__subtodos"
      >
        <ItemEntity
          v-for="subtodo in filteredItems"
          :key="subtodo.id"
        >
          <template
            v-if="itemType !== 'note'"
            #checkbox
          >
            <ItemCheckbox
              :model-value="subtodo.isDone"
              @update:model-value="replaceItemInStorage(subtodo)"
            />
          </template>
          <template #title>
            {{ subtodo.subtodos }}
          </template>
        </ItemEntity>
        <slot :subtodos="item.subtodos" />
      </div>
      <div v-else-if="showSubtodosToggle && filteredItems.length === 0">
        <p>No subtodos!</p>
      </div> -->
    </ItemEntity>
  </div>
  <div
    v-else
    class="mt-4"
  >
    <strong>No items</strong>
  </div>
</template>

<style lang="scss">
.item-list {
  min-width: 350px;
  max-width: 60% or 1024px;
}
</style>
