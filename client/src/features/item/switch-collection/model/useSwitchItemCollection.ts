import { ShallowRef } from 'vue'
import {
  type Item,
  updateItem,
  replaceItemInList,
  updateItemWithSubItems,
  replaceItemsInList,
} from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'
import { useShowSubItems } from '../../show-sub-items'

export const useSwitchItemCollection = (items: ShallowRef<Item[]>) => {
  const { hasSubItems } = useShowSubItems(items)

  const switchItemCollection = async (item: Item, collectionId: number) => {
    const newItem = updateItem(item, { collectionId })

    if (hasSubItems(item.id)) {
      const newItems = updateItemWithSubItems(items.value, item, { collectionId })
      items.value = replaceItemsInList(items.value, newItems)
    } else {
      items.value = replaceItemInList(items.value, newItem)
    }
    await updateItemOnServer(item.id, newItem)
  }

  return { switchItemCollection }
}
