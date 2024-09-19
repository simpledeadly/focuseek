<script setup lang="ts">
import { ItemEntity, useItems } from '@/entities/item'
import { AddItemForm, useAddItem } from '@/features/item/add'
import { ItemTitle, useChangeItemTitle } from '@/features/item/change-title'
import { TypeSelect, useChangeItemType } from '@/features/item/change-type'
import { ItemCheckbox, useDoneItem } from '@/features/item/done'
import { ItemTypeSelect, useFilterItems } from '@/features/item/filter'
import { ItemRemoveButton, useRemoveItem } from '@/features/item/remove'
import { ref } from 'vue'

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

const showTodosToggle = ref<boolean>(false)

const handleToggle = () => (showTodosToggle.value = !showTodosToggle.value)
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
        v-if="itemType !== 'material'"
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
        #showTodosToggle
      >
        <button
          type="button"
          @click="handleToggle"
        >
          {{ showTodosToggle ? 'Hide' : 'Show' }}
        </button>
      </template>
      <template #typeSelect>
        <TypeSelect
          :model-value="item.type"
          @update:model-value="changeItemType(item, $event)"
        />
      </template>
      <!-- <div
        v-if="slots.default && showTodosToggle && item.subtodos && item.subtodos.length > 0"
        class="item-list__subtodos"
      >
        <ItemEntity
          v-for="subtodo in filteredItems"
          :key="subtodo.id"
        >
          <template
            v-if="itemType !== 'material'"
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
      <div v-else-if="showTodosToggle && filteredItems.length === 0">
        <p>No subtodos!</p>
      </div> -->
    </ItemEntity>
  </div>
  <div v-else>
    <p>No items!</p>
  </div>
</template>

<style lang="scss">
.item-list {
  /** keep */
}
</style>
