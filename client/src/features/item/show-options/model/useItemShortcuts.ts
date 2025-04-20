import { ref, onMounted, onUnmounted, Ref } from 'vue'
import Mousetrap from 'mousetrap'
import { Item } from '@/entities/item'

export type Emit = {
  (e: 'remove'): void
  (e: 'add-description'): void
  (e: 'remove-description'): void
  (e: 'edit-priority', value: number | undefined): void
  (e: 'change-type'): void
}

interface UseItemShortcutsParams {
  dropdownRef: Ref<HTMLElement | null>
  isMenuOpen: Ref<boolean>
  priority: Ref<number | undefined>
  modelPriority: Ref<number | undefined>
  props: { item: Item }
  emit: Emit
}

export const useItemShortcuts = ({
  dropdownRef,
  isMenuOpen,
  priority,
  modelPriority,
  props,
  emit,
}: UseItemShortcutsParams) => {
  const isPriorityMode = ref(false)
  let priorityTimeout: ReturnType<typeof setTimeout> | null = null

  const exitPriorityMode = () => {
    isPriorityMode.value = false
    isMenuOpen.value = false
    if (priorityTimeout) {
      clearTimeout(priorityTimeout)
      priorityTimeout = null
    }
  }

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
      dropdownRef.value instanceof HTMLElement ? new Mousetrap(dropdownRef.value) : new Mousetrap()

    const bindings: {
      keys: string | string[]
      guard: () => boolean
      action: (e: KeyboardEvent, key?: string) => void
    }[] = [
      {
        keys: 'r',
        guard: () => isMenuOpen.value && !isPriorityMode.value,
        action: () => {
          emit('remove')
          isMenuOpen.value = false
        },
      },
      {
        keys: 'd',
        guard: () => isMenuOpen.value && !isPriorityMode.value && !props.item.description,
        action: () => {
          emit('add-description')
          isMenuOpen.value = false
        },
      },
      {
        keys: 't',
        guard: () => isMenuOpen.value && !isPriorityMode.value,
        action: () => {
          emit('change-type')
          isMenuOpen.value = false
        },
      },
      {
        keys: 'shift+d',
        guard: () => isMenuOpen.value && !isPriorityMode.value && !!props.item.description,
        action: () => {
          emit('remove-description')
          isMenuOpen.value = false
        },
      },
      {
        keys: 'p',
        guard: () => isMenuOpen.value && !isPriorityMode.value,
        action: () => {
          isPriorityMode.value = true
          priorityTimeout = setTimeout(exitPriorityMode, 1000)
        },
      },
      {
        keys: ['1', '2', '3'],
        guard: () => isPriorityMode.value,
        action: (_, key) => {
          if (!key) return
          const map: Record<string, number> = { '1': 1, '2': 2, '3': 3 }
          const val = map[key]
          if (val === undefined) return
          priority.value = val
          modelPriority.value = val
          emit('edit-priority', val)
          exitPriorityMode()
        },
      },
      {
        keys: '0',
        guard: () => isPriorityMode.value,
        action: () => {
          priority.value = 0
          modelPriority.value = 0
          emit('edit-priority', 0)
          exitPriorityMode()
        },
      },
    ]

    for (const { keys, guard, action } of bindings) {
      mousetrap.bind(keys, withGuard(guard, action))
    }

    onUnmounted(() => {
      mousetrap.reset()
      if (priorityTimeout) clearTimeout(priorityTimeout)
    })
  })

  return { isPriorityMode }
}
