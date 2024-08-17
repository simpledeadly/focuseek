<script setup lang="ts">
import { AInput, ASelect, ListItem } from '@/components'
import { useItemsStore, type ChooseType, type ItemType } from '@/store'
import { ref, type Ref } from 'vue'

const chosenType = ref<ChooseType>('inbox')

const store = useItemsStore()

// watch(store.items, () => console.log('Updated db:\n', toRaw(store.items)))

function handleAddItem(text: Ref<string>) {
  const newItem: ItemType = {
    id: Date.now(),
    title: text.value,
    type: chosenType.value,
    isEditting: false
  }

  switch (chosenType.value) {
    case 'material':
      break
    case 'todo' || 'inbox':
      newItem.isDone = false
      break
    case 'project':
      newItem.isDone = false
      newItem.subtodos = []
      break
  }

  store.addTodo(newItem)
  console.log('New item:', newItem)
}
</script>

<template>
  <AInput @send="(text: Ref<string>) => handleAddItem(text)" />
  <ASelect v-model="chosenType" />
  <ul v-if="store.items.length !== 0" class="list">
    <ListItem v-for="item in store.items" :item="item" />
  </ul>
  <p v-else>No items!</p>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
