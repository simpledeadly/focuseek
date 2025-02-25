import { updateItem, type Item } from '@/entities/item'
import { replaceItemInList } from '@/entities/item/lib/item'
import { updateItemOnServer } from '@/shared/api/api'
import { ShallowRef } from 'vue'

export const useDoneItem = (items: ShallowRef<Item[]>) => {
  const toggleDoneItem = async (item: Item) => {
    const newItem = updateItem(item, { isDone: !item.isDone })
    await updateItemOnServer(item.id, newItem)
    items.value = replaceItemInList(items.value, newItem)
  }

  return { toggleDoneItem }
}
