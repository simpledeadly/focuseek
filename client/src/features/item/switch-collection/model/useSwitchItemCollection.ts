import { ShallowRef } from 'vue'
import { updateItem, replaceItemInList, type Item } from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'

export const useSwitchItemCollection = (items: ShallowRef<Item[]>) => {
  const switchItemCollection = async (item: Item, collectionId: number) => {
    const newItem = updateItem(item, { collectionId })
    await updateItemOnServer(item.id, newItem)
    items.value = replaceItemInList(items.value, newItem)
  }

  return { switchItemCollection }
}
