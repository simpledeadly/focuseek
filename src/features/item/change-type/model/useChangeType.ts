import { updateItem, type Item, type ItemType } from '@/entities/item'
import { replaceItemInList } from '@/entities/item/lib/item'
import { updateItemOnServer } from '@/shared/api/api'
import { ShallowRef } from 'vue'

export const useChangeItemType = (items: ShallowRef<Item[]>) => {
  const changeItemType = (item: Item, type: ItemType) => {
    const newItem = updateItem(item, { type })
    items.value = replaceItemInList(items.value, newItem)
    updateItemOnServer(item.id, newItem)
  }

  return { changeItemType }
}
