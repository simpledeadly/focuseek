import { ShallowRef } from 'vue'
import {
  type Item,
  type ItemType,
  updateItem,
  replaceItemInList,
  updateItemWithSubItems,
  replaceItemsInList,
} from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'
import { useShowSubItems } from '../../show-sub-items'

export const useSwitchItemType = (items: ShallowRef<Item[]>) => {
  const { hasSubItems } = useShowSubItems(items)

  const switchItemType = async (item: Item, type: ItemType) => {
    const newItem = updateItem(item, { type })

    if (hasSubItems(item.id)) {
      const newItems = updateItemWithSubItems(items.value, item, { type })
      items.value = replaceItemsInList(items.value, newItems)
    } else {
      items.value = replaceItemInList(items.value, newItem)
    }
    await updateItemOnServer(item.id, newItem)
  }

  return { switchItemType }
}
