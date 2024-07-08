<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/ui/table'

const props = defineProps<{
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	noCols?: Boolean
}>()

const table = useVueTable({
	get data() {
		return props.data
	},
	get columns() {
		return props.columns
	},
	getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
	<div class="border rounded-md">
		<Table>
			<TableHeader v-if="!noCols">
				<TableRow
					v-for="headerGroup in table.getHeaderGroups()"
					:key="headerGroup.id"
				>
					<TableHead v-for="header in headerGroup.headers" :key="header.id">
						<FlexRender
							v-if="!header.isPlaceholder"
							:render="header.column.columnDef.header"
							:props="header.getContext()"
						/>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows?.length">
					<TableRow
						v-for="row in table.getRowModel().rows"
						:key="row.id"
						:data-state="row.getIsSelected() ? 'selected' : undefined"
						:class="row.getIsSelected() ? 'selected' : null"
					>
						<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
							<FlexRender
								:render="cell.column.columnDef.cell"
								:props="cell.getContext()"
							/>
						</TableCell>
					</TableRow>
				</template>
				<template v-else>
					<TableRow>
						<TableCell :colspan="columns.length" class="h-24 text-center">
							Empty here.
						</TableCell>
					</TableRow>
				</template>
			</TableBody>
		</Table>
	</div>
</template>

<style lang="scss">
// @use '../../../assets/styles/global.scss' as *;

// .selected {
// 	background: --border;
// }
</style>
