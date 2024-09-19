import { createItem, Item, type ItemType } from '@/entities/item'
import { addItemToList } from '@/entities/item/lib/item'
import { ShallowRef } from 'vue'

export const useAddItem = (items: ShallowRef<Item[]>) => {
  const addItem = (title: string, type: ItemType) => {
    const item = createItem(title, type)
    items.value = addItemToList(items.value, item)
  }

  return { addItem }
}
