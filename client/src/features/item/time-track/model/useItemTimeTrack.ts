import { ShallowRef } from 'vue'
import { updateItem, replaceItemInList, type Item } from '@/entities/item'
import { deleteTimerOnServer, updateItemOnServer } from '@/shared/api/api'

export const useItemTimeTrack = (items: ShallowRef<Item[]>) => {
  const changeItemDurationPlanned = async (item: Item, durationPlanned?: number | null) => {
    const newItem = updateItem(item, { durationPlanned })
    await updateItemOnServer(item.id, newItem)
    items.value = replaceItemInList(items.value, newItem)
  }

  const changeItemDurationReal = async (item: Item, durationReal?: number | null) => {
    const newItem = updateItem(item, { durationReal })
    await updateItemOnServer(item.id, newItem)
    items.value = replaceItemInList(items.value, newItem)
  }

  const deleteTimer = async (item: Item, value: number | null) => {
    if (item.durationReal) {
      await deleteTimerOnServer(item.id)
    }
    changeItemDurationReal(item, value)
    localStorage.removeItem(`timer_${item.id}`)
  }

  return { changeItemDurationPlanned, changeItemDurationReal, deleteTimer }
}

/*
TODO:
- [] 1. Вынести функции в эту модель, заменить функции в UI эмитами.
*/
