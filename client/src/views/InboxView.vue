<script setup lang="ts">
import { fetchItems } from '@/shared/lib/items'
import { onMounted, ref } from 'vue'
import { Item } from '../../../common/types/interfaces'

const items = ref<Item[]>([])

onMounted(async () => {
	const res = await fetchItems()
	items.value = Object.values(res)
})
</script>

<template>
	<div>
		<h2>Inbox</h2>
		<!-- *widget here (entitie and features in widget)* -->
		<ul v-if="items && items.length > 0">
			<li v-for="item in items" :key="item.id">
				{{ item.text }} - {{ item.category }}
			</li>
		</ul>
		<h2 v-else>Nothing here</h2>
	</div>
</template>

<style lang="scss" scoped></style>
