import { useItems, type Item } from '@/entities/item'

export const useRemoveItem = () => {
  const { removeItemFromStorage } = useItems()

  const removeItem = (item: Item) => {
    removeItemFromStorage(item)
  }

  return { removeItem }
}
