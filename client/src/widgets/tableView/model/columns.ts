import { Item } from '@/../../common/types/interfaces'
import { Checkbox } from '@/shared/ui/checkbox'
import DataSelect from '@/widgets/tableView/model/dataSelect.vue'
import { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

export const columns: ColumnDef<Item>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			h(Checkbox, {
				checked:
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate'),
				'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
				ariaLabel: 'Select all',
			}),
		cell: ({ row }) =>
			h(Checkbox, {
				checked: row.getIsSelected(),
				'onUpdate:checked': value => row.toggleSelected(!!value),
				ariaLabel: 'Select row',
			}),
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('title')),
	},
	{
		accessorKey: 'category',
		header: () => h('div', {}, 'Category'),
		cell: ({ row }) => h(DataSelect, {}, row.getValue('category')),
	},
]
