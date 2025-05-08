import { ShallowRef } from 'vue'
import { type Item } from '@/entities/item'
import { deleteTimerOnServer } from '@/shared/api/api'
import { useItemUpdater } from '../../composables'

export const useItemTimeTrack = (items: ShallowRef<Item[]>) => {
  const { updateItemProperty } = useItemUpdater(items)

  const deleteTimer = async (item: Item, value: number | null) => {
    if (item.durationReal) {
      await deleteTimerOnServer(item.id)
    }
    updateItemProperty(item, { durationReal: value })
    localStorage.removeItem(`timer_${item.id}`)
  }

  return { deleteTimer }
}
