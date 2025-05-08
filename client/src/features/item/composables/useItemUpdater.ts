import { ShallowRef } from 'vue'
import {
  type Item,
  updateItem,
  replaceItemInList,
  updateItemWithSubItems,
  replaceItemsInList,
} from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'
import { handleError } from '@/shared/lib/utils'

interface ItemUpdatePayload {
  [key: string]: any
  updateServer?: boolean
}

interface ItemActionOptions {
  withChildren?: boolean
}

export const useItemUpdater = (items: ShallowRef<Item[]>) => {
  const updateItemProperty = async (
    item: Item,
    payload: ItemUpdatePayload,
    options: ItemActionOptions = {}
  ) => {
    const { updateServer = true, ...fields } = payload
    const newItem = updateItem(item, fields)

    try {
      if (updateServer) {
        await updateItemOnServer(item.id, newItem)
      }

      items.value = options.withChildren
        ? replaceItemsInList(items.value, updateItemWithSubItems(items.value, newItem, fields))
        : replaceItemInList(items.value, newItem)
    } catch (error) {
      handleError(error, `Ошибка при обновлении элемента ${item.id}, item: ${item}`)
    }
  }

  return { updateItemProperty }
}
