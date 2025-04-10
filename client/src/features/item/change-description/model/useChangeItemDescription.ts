import { ShallowRef } from 'vue'
import { updateItem, replaceItemInList, type Item } from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'

export const useChangeItemDescription = (items: ShallowRef<Item[]>) => {
  const changeItemDescription = async (item: Item, description: string) => {
    const newItem = updateItem(item, { description })
    try {
      await updateItemOnServer(item.id, newItem)
      items.value = replaceItemInList(items.value, newItem)
    } catch (error) {
      console.error('Ошибка при изменении описания элемента:', error)
    }
  }

  return { changeItemDescription }
}
