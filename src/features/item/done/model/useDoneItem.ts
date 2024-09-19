import { updateItem, type Item } from '@/entities/item'
import { replaceItemInList } from '@/entities/item/lib/item'
import { ShallowRef } from 'vue'

export const useDoneItem = (items: ShallowRef<Item[]>) => {
  const toggleDoneItem = (item: Item) => {
    const newItem = updateItem(item, { isDone: !item.isDone })
    items.value = replaceItemInList(items.value, newItem)
  }

  return { toggleDoneItem }
}
