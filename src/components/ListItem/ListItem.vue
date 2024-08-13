<script setup lang="ts">
import { ASelect } from '@/components'
import { useItemsStore, type ItemType } from '@/store'
import { ref } from 'vue'

const newText = ref<string>('')

const props = defineProps<{
  item: ItemType
}>()

const store = useItemsStore()

function handleStartEditting() {
  props.item.isEditting = true
  newText.value = props.item.title
}

function handleCancel() {
  props.item.title = newText.value
  props.item.isEditting = false
}
</script>

<template>
  <li class="list-item">
    <div v-if="!item.isEditting" class="container">
      <input type="checkbox" v-model="item.isDone" />
      <div :class="item.isDone && 'done-task'">{{ item.title }}</div>
      <div class="action" @click="handleStartEditting">ㅤ✎</div>
      <div class="action" @click="store.removeTodo(item.id)">ㅤ&times;ㅤ</div>
      <ASelect v-model="item.type" />
    </div>
    <div v-else class="container">
      <input class="input-editting" type="text" v-model="item.title" />
      <button class="button-action" @click="item.isEditting = false">✓</button>
      <button class="button-action" @click="handleCancel">&times;</button>
    </div>
  </li>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
