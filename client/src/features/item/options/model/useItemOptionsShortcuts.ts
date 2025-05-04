import { ref, onMounted, onUnmounted, Ref } from 'vue'
import Mousetrap from 'mousetrap'
import { Item } from '@/entities/item'

export type Emit = {
  (e: 'remove'): void
  (e: 'add-description'): void
  (e: 'open-details-page'): void
  (e: 'remove-description'): void
  (e: 'edit-priority', value: number | null): void
  (e: 'change-duration-planned', value: number | null): void
  (e: 'change-duration-real', value: number | null): void
  (e: 'change-duration-real-from-opitons', value: number | null): void
  (e: 'change-type'): void
  (e: 'toggle-sub-item-form'): void
}

interface UseItemOptionsShortcutsParams {
  dropdownRef: Ref<HTMLElement | null>
  isMenuOpen: Ref<boolean>
  priority: Ref<number | undefined | null>
  modelPriority: Ref<number | undefined | null>
  props: { item: Item; hasSubItems: boolean }
  emit: Emit
}

export const useItemOptionsShortcuts = ({
  dropdownRef,
  isMenuOpen,
  priority,
  modelPriority,
  props,
  emit,
}: UseItemOptionsShortcutsParams) => {
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
        keys: ['r', 'к'],
        guard: () => isMenuOpen.value && !isPriorityMode.value,
        action: () => {
          emit('remove')
          isMenuOpen.value = false
        },
      },
      {
        keys: ['g', 'п'],
        guard: () => isMenuOpen.value && !isPriorityMode.value,
        action: () => {
          emit('open-details-page')
          isMenuOpen.value = false
        },
      },
      {
        keys: ['d', 'в'],
        guard: () =>
          isMenuOpen.value &&
          !isPriorityMode.value &&
          (!props.item.description || !!props.item.description),
        action: () => {
          props.item.description === null ? emit('add-description') : emit('remove-description')
          isMenuOpen.value = false
        },
      },
      {
        keys: ['s', 'ы'],
        guard: () =>
          isMenuOpen.value &&
          !isPriorityMode.value &&
          !props.hasSubItems &&
          (!props.item.showSubItems || props.item.showSubItems),
        action: () => {
          emit('toggle-sub-item-form')
          isMenuOpen.value = false
        },
      },
      {
        keys: ['t', 'е'],
        guard: () => isMenuOpen.value && !isPriorityMode.value,
        action: () => {
          emit('change-type')
          isMenuOpen.value = false
        },
      },
      {
        keys: ['e', 'у'],
        guard: () =>
          isMenuOpen.value &&
          !isPriorityMode.value &&
          (props.item.durationReal === null || props.item.durationReal !== null),
        action: () => {
          props.item.durationReal !== null
            ? emit('change-duration-real-from-opitons', null)
            : emit('change-duration-real-from-opitons', 0)
          isMenuOpen.value = false
        },
      },
      {
        keys: ['shift+e', 'shift+у'],
        guard: () =>
          isMenuOpen.value &&
          !isPriorityMode.value &&
          props.item.durationReal !== 0 &&
          props.item.durationReal !== null,
        action: () => {
          emit('change-duration-real-from-opitons', 0)
          isMenuOpen.value = false
        },
      },
      {
        keys: ['f', 'а'],
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
        keys: '4',
        guard: () => isPriorityMode.value,
        action: () => {
          priority.value = null
          modelPriority.value = null
          emit('edit-priority', null)
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
