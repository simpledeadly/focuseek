<script setup lang="ts">
import { useItemsStore } from '@/app/store'
import { ItemModel, ListItem, type ChooseType, type ItemType } from '@/entities/Item'
import { AInput, ASelect } from '@/shared/ui'
import { computed, ref } from 'vue'

const store = useItemsStore()
const itemModel = ItemModel()

const props = defineProps<{
  filterWord: ChooseType
}>()

const items = computed(() => {
  if (store.hideChecked === true) {
    return store.items.filter((item: ItemType) => item.type === props.filterWord && !item.isDone)
  }
  return store.items.filter((item: ItemType) => item.type === props.filterWord)
})

const chosenType = ref<ChooseType>(props.filterWord)
</script>

<template>
  <AInput @send="itemModel.addItem($event, chosenType)" />
  <ASelect v-model="chosenType" />
  <ul
    v-if="items.length !== 0"
    class="list"
  >
    <ListItem
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :is-done="item.isDone"
      :type="item.type"
      @update:type="itemModel.changeItemType(item.id, $event)"
      @update:title="itemModel.changeItem(item.id, { title: $event })"
      @update:is-done="itemModel.changeItem(item.id, { isDone: $event })"
      @remove="itemModel.removeItem(item.id)"
    />
  </ul>
  <p v-else>No one {{ props.filterWord }}!</p>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
