<script setup lang="ts">
import { AInput, ASelect, ListItem } from '@/components'
import { useItemsStore, type ChooseType } from '@/store'
import { ref } from 'vue'

const store = useItemsStore()
const chosenType = ref<ChooseType>('inbox')
</script>

<template>
  <AInput @send="store.addItem($event, chosenType)" />
  <ASelect v-model="chosenType" />
  <ul
    v-if="store.items.length !== 0"
    class="list"
  >
    <ListItem
      v-for="item in store.items"
      :title="item.title"
      :is-done="item.isDone"
      :type="item.type"
      @update:type="store.changeType(item.id, $event)"
      @update:title="store.changeItem(item.id, { title: $event })"
      @update:is-done="store.changeItem(item.id, { isDone: $event })"
      @remove="store.removeItem(item.id)"
    />
  </ul>
  <p v-else>No items!</p>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
