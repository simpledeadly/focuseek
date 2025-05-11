import { ShallowRef } from 'vue'
import { useAuth } from '@/app/auth/useAuth'
import { createItem, addItemToList, Item, type ItemType } from '@/entities/item'
import { addItemToServer } from '@/shared/api/api'
import { useCollections } from '@/entities/collection'

const { getUserId } = useAuth()
const { findIdByCollectionTitle } = useCollections()

export const useAddItem = (items: ShallowRef<Item[]>) => {
  const addItem = async (
    collectionId: number,
    title: string,
    type: ItemType,
    parentItemId?: number | null,
    description?: string | null,
    deadline?: number,
    date?: number,
    priority?: number | null,
    durationPlanned?: number | null,
    tags?: string[]
  ) => {
    const item = createItem(
      getUserId!,
      collectionId ? collectionId : findIdByCollectionTitle('Today') || 9,
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
