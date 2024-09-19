import { updateItem, type Item, type ItemType } from '@/entities/item'
import { replaceItemInList } from '@/entities/item/lib/item'
import { ShallowRef } from 'vue'

export const useChangeItemType = (items: ShallowRef<Item[]>) => {
  const changeItemType = (item: Item, type: ItemType) => {
    const newItem = updateItem(item, { type })
    items.value = replaceItemInList(items.value, newItem)
  }

  return { changeItemType }
}
