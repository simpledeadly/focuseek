<script setup lang="ts">
import { fetchItems } from '@/shared/lib/items'
import { DataTable } from '@/widgets/tableView'
import { columns } from '@/widgets/tableView/model'
import { onMounted, ref } from 'vue'
import { Item } from '../../../common/types/interfaces'

const items = ref<Item[]>([])

onMounted(async () => {
	const res = await fetchItems()
	items.value = res.map(proxy => ({
		id: proxy.id,
		title: proxy.title,
		category: proxy.category,
	}))
})
</script>

<template>
	<div class="container py-10 mx-auto">
		<DataTable :columns="columns" :data="items" noCols="true" />
	</div>
</template>

<style lang="scss" scoped></style>
