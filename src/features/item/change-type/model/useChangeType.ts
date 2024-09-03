import { updateItem, useItems, type Item, type ItemType } from '@/entities/item'

export const useChangeItemType = () => {
  const { replaceItemInStorage } = useItems()

  const changeItemType = (item: Item, type: ItemType) => {
    const newItem = updateItem(item, { type })
    replaceItemInStorage(newItem)
  }

  return { changeItemType }
}
