import type { Item, State } from '@/../../common/types/types'
import {
	addItemToServer,
	deleteItemFromServer,
	fetchItemsFromServer,
} from '@/shared/api/api'
import { defineStore } from 'pinia'

export const useItemsStore = defineStore({
	id: 'items',
	state: (): State => ({
		items: [],
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
		changeItemType(
			id: number,
			newType: 'inbox' | 'material' | 'todo' | 'project'
		) {
			const item = this.items.find(item => item.id === id)

			if (item) {
				item.type = newType
				if (newType === 'material') {
					delete item.isDone
					delete item.subtodos
				}
				if (newType === 'todo' || newType === 'project') {
					item.isDone = false
				}
				if (newType === 'project') {
					item.subtodos = []
				}
			}
		},
	},
	getters: {
		getItemsByType:
			state => (type: 'inbox' | 'material' | 'todo' | 'project') => {
				// state.items.length === 0 && console.error('Элементы не загрузились')
				return state.items.filter(item => item.type === type)
			},
	},
})

useItemsStore().fetchItemsFromStoreFromServer()
