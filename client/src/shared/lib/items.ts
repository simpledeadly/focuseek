import type { Item } from '@/../../common/types/types'
import { useItemsStore } from '@/app/store/store'

const store = useItemsStore()

export const fetchItems = async () => {
	await store.fetchItemsFromStoreFromServer()
	return store.items
}

export const addItem = async (item: Item) => {
	await store.addItemFromStoreToServer(item)
}

export const deleteItem = async (id: number) => {
	await store.deleteItemFromStoreFromServer(id)
}
