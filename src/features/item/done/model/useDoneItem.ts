import { updateItem, useItems, type Item } from '@/entities/item'

export const useDoneItem = () => {
  const { replaceItemInStorage } = useItems()

  const toggleDoneItem = (item: Item) => {
    const newItem = updateItem(item, { isDone: !item.isDone })
    replaceItemInStorage(newItem)
  }

  return { toggleDoneItem }
}
