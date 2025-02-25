import { updateItem, type Item } from '@/entities/item'
import { replaceItemInList } from '@/entities/item/lib/item'
import { updateItemOnServer } from '@/shared/api/api'
import { ShallowRef } from 'vue'

export const useChangeItemTitle = (items: ShallowRef<Item[]>) => {
  const changeItemTitle = async (item: Item, title: string) => {
    const newItem = updateItem(item, { title })
    try {
      await updateItemOnServer(item.id, newItem)
      items.value = replaceItemInList(items.value, newItem)
    } catch (error) {
      console.error('Ошибка при изменении названия элемента:', error)
    }
  }

  return { changeItemTitle }
}
