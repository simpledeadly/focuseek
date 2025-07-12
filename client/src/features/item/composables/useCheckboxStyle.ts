import { Pack, PackKey } from '@/app/packs'
import { computed, Ref, unref } from 'vue'

export const checkboxStyle = (
  priorityRef: Ref<number | undefined | null>,
  isDoneRef?: Ref<boolean | undefined>
) => {
  const pack: Pack = JSON.parse(localStorage.getItem('pack')!)

  return computed(() => {
    const priority = unref(priorityRef)
    const isDone = isDoneRef ? unref(isDoneRef) : false

    if (!pack || !priority) return {}

    const key = `p${priority}` as PackKey
    const color = pack[key]

    if (!color) return {}

    if (isDone) {
      return {
        border: `1px solid ${color}`,
        background: color,
      }
    } else {
      return {
        border: `2px solid ${color}`,
        background: 'transparent',
      }
    }
  })
}
