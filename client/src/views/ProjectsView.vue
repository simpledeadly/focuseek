<script setup lang="ts">
import { Table } from '@/widgets/tableView'

const columns = ['Title', 'Category']
</script>

<template>
	<script setup lang="ts">
		import { DataTable } from '@/widgets/tableView'
		import { columns } from '@/widgets/tableView/model/columns'
		import { Payment } from '@/widgets/tableView/model/data'
		import { onMounted, ref } from 'vue'

		const data = ref<Payment[]>([])

		async function getData(): Promise<Payment[]> {
			// Fetch data from your API here.
			return [
				{
					id: '728ed52f',
					amount: 100,
					status: 'pending',
					email: 'm@example.com',
				},
				{
					id: '489e1d42',
					amount: 125,
					status: 'processing',
					email: 'example@gmail.com',
				},
			]
		}

		onMounted(async () => {
			data.value = await getData()
		})
	</script>

	<template>
		<div class="container py-10 mx-auto">
			<DataTable :columns="columns" :data="data" />
		</div>
	</template>

	<style lang="scss" scoped></style>

	<Table :columns="columns" filter="project" />
</template>

<style lang="scss" scoped></style>
