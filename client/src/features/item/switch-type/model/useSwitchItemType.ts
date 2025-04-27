import { ShallowRef } from 'vue'
import { updateItem, replaceItemInList, type Item, type ItemType } from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'

export const useSwitchItemType = (items: ShallowRef<Item[]>) => {
  const switchItemType = async (item: Item, type: ItemType) => {
    const newItem = updateItem(item, { type })
    try {
      await updateItemOnServer(item.id, newItem)
      items.value = replaceItemInList(items.value, newItem)
    } catch (error) {
      console.error('Ошибка при изменении типа элемента:', error)
    }
  }

  return { switchItemType }
}
