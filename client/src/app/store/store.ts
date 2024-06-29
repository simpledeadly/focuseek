import { Item } from '@/../../common/types/interfaces'
import {
	addItemToServer,
	deleteItemFromServer,
	fetchItemsFromServer,
} from '@/shared/api/api'
import { defineStore } from 'pinia'

export const useItemsStore = defineStore({
	id: 'items',
	state: () => ({
		items: [] as Item[],
	}),
	actions: {
		async fetchItemsFromStoreFromServer() {
			try {
				const items = await fetchItemsFromServer()

				this.items = items
			} catch (e) {
				console.error('Ошибка при загрузке данных:', e)
			}
		},
		async addItemFromStoreToServer(item: Item) {
			try {
				await addItemToServer(item)

				this.items.push(item)
			} catch (e) {
				console.error('Ошибка при добавлении элемента:', e)
			}
		},
		async deleteItemFromStoreFromServer(id: number) {
			try {
				await deleteItemFromServer(id)

				this.items = this.items.filter(item => item.id !== id)
			} catch (e) {
				console.error('Ошибка при удалении элемента:', e)
			}
		},
	},
})
