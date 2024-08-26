<script setup lang="ts">
import { AInput, ASelect, ListItem } from '@/components'
import { useItemsStore, type ChooseType, type ItemType } from '@/store'
import { computed, ref, watch } from 'vue'

const store = useItemsStore()

const props = defineProps<{
  filterWord: ChooseType
}>()

console.log(store.hideChecked)
watch(
  () => store.hideChecked,
  () => {
    console.log(store.hideChecked)
  }
)

const items = computed(() => {
  if (store.hideChecked === true) {
    return store.items.filter((item: ItemType) => item.type === props.filterWord && !item.isDone)
  }
  return store.items.filter((item: ItemType) => item.type === props.filterWord)
})

const chosenType = ref<ChooseType>(props.filterWord)
</script>

<template>
  <AInput @send="store.addItem($event, chosenType)" />
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
      @update:type="store.changeType(item.id, $event)"
      @update:title="store.changeItem(item.id, { title: $event })"
      @update:is-done="store.changeItem(item.id, { isDone: $event })"
      @remove="store.removeItem(item.id)"
    />
  </ul>
  <p v-else>No one {{ props.filterWord }}!</p>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
