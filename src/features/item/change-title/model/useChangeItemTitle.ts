import { updateItem, type Item } from '@/entities/item'
import { replaceItemInList } from '@/entities/item/lib/item'
import { ShallowRef } from 'vue'

export const useChangeItemTitle = (items: ShallowRef<Item[]>) => {
  const changeItemTitle = (item: Item, title: string) => {
    const newItem = updateItem(item, { title })
    items.value = replaceItemInList(items.value, newItem)
  }

  return { changeItemTitle }
}
