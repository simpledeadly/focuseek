import { ShallowRef } from 'vue'
import { updateItem, replaceItemInList, type Item } from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'

export const useChangeItemPriority = (items: ShallowRef<Item[]>) => {
  const changeItemPriority = async (item: Item, priority?: number | null) => {
    const newItem = updateItem(item, { priority })
    await updateItemOnServer(item.id, newItem)
    items.value = replaceItemInList(items.value, newItem)
  }

  return { changeItemPriority }
}
