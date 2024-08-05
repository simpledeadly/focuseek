<script setup lang="ts">
import { useItemsStore } from '@/app/store/store'
import { computed } from 'vue'
import { ItemsListItem } from '../ItemsListItem'

const props = defineProps<{
	filter: 'inbox' | 'material' | 'todo' | 'project'
}>()

const store = useItemsStore()
const inboxItems = computed(() => store.getItemsByType(props.filter))
</script>

<template>
	<ul v-if="inboxItems.length > 0">
		<ItemsListItem v-for="item in inboxItems" :key="item.id" :item="item" />
	</ul>
	<h1 v-else>No {{ filter === 'inbox' ? filter + '' : filter + 's' }}.</h1>
</template>

<style lang="scss"></style>
