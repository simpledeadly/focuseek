import { ShallowRef } from 'vue'
import { type Item } from '@/entities/item'
import { deleteTimerOnServer } from '@/shared/api/api'
import { useItemUpdater } from '../../composables'

export const useItemTimeTrack = (items: ShallowRef<Item[]>) => {
  const { updateItemProperty } = useItemUpdater(items)

  const handleTimer = (action: 'reset' | 'remove') => async (item: Item) => {
    if (item.durationReal) {
      await deleteTimerOnServer(item.id)
    }
    updateItemProperty(
      item,
      action === 'remove'
        ? {
            durationPlanned: null,
            durationReal: null,
          }
        : {
            durationReal: 0,
          }
    )
    localStorage.removeItem(`timer_${item.id}`)
  }

  return {
    resetTimer: handleTimer('reset'),
    deleteTimer: handleTimer('remove'),
  }
}
