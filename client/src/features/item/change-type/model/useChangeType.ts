import { updateItem, type Item, type ItemType } from '@/entities/item'
import { replaceItemInList } from '@/entities/item/lib/item'
import { updateItemOnServer } from '@/shared/api/api'
import { ShallowRef } from 'vue'

export const useChangeItemType = (items: ShallowRef<Item[]>) => {
  const changeItemType = async (item: Item, type: ItemType) => {
    const newItem = updateItem(item, { type })
    try {
      await updateItemOnServer(item.id, newItem)
      items.value = replaceItemInList(items.value, newItem)
    } catch (error) {
      console.error('Ошибка при изменении типа элемента:', error)
    }
  }

  return { changeItemType }
}
