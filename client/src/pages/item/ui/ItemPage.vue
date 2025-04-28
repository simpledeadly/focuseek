<script setup lang="ts">
import { Collection, useCollections } from '@/entities/collection'
import { useItems } from '@/entities/item'

const emit = defineEmits<{
  (e: 'collections', value: Collection[]): void
}>()

const { item } = useItems()
const { collections } = useCollections()

setTimeout(() => {
  emit('collections', collections.value)
}, 50)
</script>

<template>
  <div class="item-page">
    <h1 style="font-size: 20px">{{ item.title }}</h1>
    <h3 v-if="item.description">{{ item.description }}</h3>
    <br />
    <p>id: {{ item.id }}</p>
    <p>userId: {{ item.userId }}</p>
    <p>collectionId: {{ item.collectionId }}</p>
    <p>type: {{ item.type }}</p>
    <p v-if="item.type === 'todo'">isDone: {{ item.isDone || false }}</p>
    <p v-if="item.priority">priority: {{ item.priority }}</p>
    <p v-if="item.durationPlanned">durationPlanned: {{ item.durationPlanned }}</p>
    <p v-if="item.durationReal">durationReal: {{ item.durationReal }}</p>
    <p v-if="item.date">date: {{ item.date }}</p>
    <p v-if="item.deadline">deadline: {{ item.deadline }}</p>
    <p>createdAt: {{ new Date(item.createdAt).toLocaleString() }}</p>
  </div>
</template>

<style lang="scss">
.item-page {
  padding-top: 2rem;
}
</style>
