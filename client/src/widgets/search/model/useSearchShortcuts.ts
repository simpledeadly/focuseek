import { onMounted, onUnmounted, Ref } from 'vue'
import Mousetrap from 'mousetrap'

interface UseSearchShortcutsParams {
  searchRef: Ref<HTMLElement | null>
  isCommandOpen: Ref<boolean>
}

export const useSearchShortcuts = ({ searchRef, isCommandOpen }: UseSearchShortcutsParams) => {
  const withGuard = (guard: () => boolean, action: (e: KeyboardEvent, key?: string) => void) => {
    return (e: KeyboardEvent, key?: string) => {
      if (!guard()) return
      e.preventDefault()
      e.stopPropagation()
      action(e, key)
      return false
    }
  }

  onMounted(() => {
    const mousetrap =
      searchRef.value instanceof HTMLElement ? new Mousetrap(searchRef.value) : new Mousetrap()

    const bindings: {
      keys: string | string[]
      guard: () => boolean
      action: (e: KeyboardEvent, key?: string) => void
    }[] = [
      {
        keys: ['command+k', 'command+л'],
        guard: () => true,
        action: () => {
          isCommandOpen.value = !isCommandOpen.value
          console.log('works!', isCommandOpen.value)
        },
      },
    ]

    for (const { keys, guard, action } of bindings) {
      mousetrap.bind(keys, withGuard(guard, action))
    }

    onUnmounted(() => {
      mousetrap.reset()
    })
  })
}
