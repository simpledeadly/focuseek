import { updateItem, useItems, type Item } from '@/entities/item'

export const useChangeItemTitle = () => {
  const { replaceItemInStorage } = useItems()

  const changeItemTitle = (item: Item, title: string) => {
    const newItem = updateItem(item, { title })
    replaceItemInStorage(newItem)
  }

  return { changeItemTitle }
}
