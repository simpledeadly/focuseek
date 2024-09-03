<script setup lang="ts">
import { ItemEntity } from '@/entities/item'
import { AddItemForm, useAddItem } from '@/features/item/add'
import { ItemTitle, useChangeItemTitle } from '@/features/item/change-title'
import { TypeSelect, useChangeItemType } from '@/features/item/change-type'
import { ItemCheckbox, useDoneItem } from '@/features/item/done'
import { ItemTypeSelect, useFilterItems } from '@/features/item/filter'
import { ItemRemoveButton, useRemoveItem } from '@/features/item/remove'

const { itemType, filteredItems } = useFilterItems()
const { addItem } = useAddItem()
const { removeItem } = useRemoveItem()
const { toggleDoneItem } = useDoneItem()
const { changeItemTitle } = useChangeItemTitle()
const { changeItemType } = useChangeItemType()
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
    class="item-list"
    v-if="filteredItems.length > 0"
  >
    <ItemEntity
      v-for="item in filteredItems"
      :key="item.id"
    >
      <template
        #checkbox
        v-if="itemType !== 'material'"
      >
        <ItemCheckbox
          :modelValue="item.isDone"
          @update:modelValue="toggleDoneItem(item)"
        />
      </template>
      <template #title>
        <ItemTitle
          :title="item.title"
          @save="changeItemTitle(item, $event)"
        />
      </template>
      <template #removeButton>
        <ItemRemoveButton @remove="removeItem(item)" />
      </template>
      <template #typeSelect>
        <TypeSelect
          :modelValue="item.type"
          @update:modelValue="changeItemType(item, $event)"
        />
      </template>
    </ItemEntity>
  </div>
  <div v-else>
    <p>No items!</p>
  </div>
</template>

<style lang="scss"></style>
