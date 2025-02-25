import { useAuth } from '@/app/useAuth'
import { createItem, Item, type ItemType } from '@/entities/item'
import { addItemToList } from '@/entities/item/lib/item'
import { addItemToServer } from '@/shared/api/api'
import { ShallowRef } from 'vue'

const { getUserId } = useAuth()

export const useAddItem = (items: ShallowRef<Item[]>) => {
  const addItem = async (title: string, type: ItemType) => {
    if (getUserId !== null) {
      const item = createItem(getUserId, title, type)
      const serverItem = await addItemToServer(item)
      items.value = addItemToList(items.value, serverItem)
    } else {
      console.log('Пользователь не авторизован')
    }
  }

  return { addItem }
}
