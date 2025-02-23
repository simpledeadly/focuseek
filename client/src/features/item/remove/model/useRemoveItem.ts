import { type Item } from '@/entities/item'
import { removeItemFromListById } from '@/entities/item/lib/item'
import { deleteItemFromServer } from '@/shared/api/api'
import { ShallowRef } from 'vue'

export const useRemoveItem = (items: ShallowRef<Item[]>) => {
  const removeItem = (item: Item) => {
    items.value = removeItemFromListById(items.value, item.id)
    deleteItemFromServer(item.id)
  }

  return { removeItem }
}
