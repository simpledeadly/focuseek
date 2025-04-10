import { ShallowRef } from 'vue'
import { useAuth } from '@/app/auth/useAuth'
import { createItem, addItemToList, Item, type ItemType } from '@/entities/item'
import { addItemToServer } from '@/shared/api/api'

const { getUserId } = useAuth()

export const useAddItem = (items: ShallowRef<Item[]>) => {
  const addItem = async (
    collectionId: number,
    title: string,
    type: ItemType,
    parentItemId?: number,
    date?: number,
    description?: string,
    priority?: number,
    durationPlanned?: number,
    tags?: string[],
    deadline?: string
  ) => {
    const item = createItem(
      getUserId!,
      collectionId,
      title,
      type,
      parentItemId,
      description,
      priority,
      durationPlanned,
      tags,
      date,
      deadline
    )
    const serverItem = await addItemToServer(item)
    items.value = addItemToList(items.value, serverItem)
  }

  return { addItem }
}
