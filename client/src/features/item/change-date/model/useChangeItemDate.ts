import { ShallowRef } from 'vue'
import { updateItem, replaceItemInList, type Item } from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'

export const useChangeItemDate = (items: ShallowRef<Item[]>) => {
  const changeItemDate = async (item: Item, date: number | undefined) => {
    const newItem = updateItem(item, { date })
    try {
      await updateItemOnServer(item.id, newItem)
      items.value = replaceItemInList(items.value, newItem)
    } catch (error) {
      console.error('Ошибка при изменении даты элемента:', error)
    }
  }

  return { changeItemDate }
}
