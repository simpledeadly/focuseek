import { createItem, useItems, type ItemType } from '@/entities/item'

export const useAddItem = () => {
  const { addItemToStorage } = useItems()

  const addItem = (title: string, type: ItemType) => {
    const item = createItem(title, type)
    addItemToStorage(item)
  }

  return { addItem }
}
