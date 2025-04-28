<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Badge } from '@/shared/ui/badge'
import { Calendar } from '@/shared/ui/calendar'
import { Checkbox } from '@/shared/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { cn, parseDurationToUnixTimestamp } from '@/shared/lib/utils'
import { useItemType } from '../../filter'
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { X } from 'lucide-vue-next'
import Mousetrap from 'mousetrap'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'

const emit = defineEmits<{
  (
    e: 'submit',
    data: {
      itemTitle: string
      parentId?: number | null
      description?: string | null
      deadline?: number
      date?: number
      priority?: number | null
      durationPlanned?: number | null
    }
  ): void
}>()

const itemTitle = ref<string>('')
const itemDescription = ref<string | null>('')
const itemDeadline = ref<number>()
const itemDate = ref<number>()
const itemParentId = ref<number | null>()
const itemPriority = ref<number | null>()

const dateValue = ref<DateValue>()
const deadlineValue = ref<DateValue>()
const durationPlannedValue = ref<string | null>()

const isShowForm = ref<boolean>(false)
const inputRef = ref<HTMLInputElement | null>(null)

const showForm = () => {
  isShowForm.value = true

  setTimeout(() => {
    if (inputRef.value) {
      inputRef.value.focus()
      if (itemTitle.value) {
        inputRef.value.select()
      }
      setTimeout(() => {
        if (document.activeElement !== inputRef.value) {
          inputRef.value?.focus()
          if (itemTitle.value) inputRef.value?.select()
        }
      }, 100)
    } else {
      console.warn('inputRef is null')
    }
  }, 100)
}

const { itemType } = useItemType()

const clearRefs = () => {
  itemTitle.value = ''
  itemDescription.value = null
  itemDeadline.value = undefined
  itemDate.value = undefined
  itemPriority.value = null
  dateValue.value = undefined
  deadlineValue.value = undefined
  durationPlannedValue.value = null
}

const handleSubmit = () => {
  if (itemTitle.value.length > 0) {
    const data = {
      itemTitle: itemTitle.value,
      parentId: Number(itemParentId.value),
      description: itemDescription.value || null,
      deadline: Number(itemDeadline.value),
      date: Number(itemDate.value),
      priority: itemPriority.value,
      durationPlanned:
        durationPlannedValue.value && Number(durationPlannedValue.value) !== 0
          ? parseDurationToUnixTimestamp(durationPlannedValue.value)
          : null,
    }
    emit('submit', data)
  } else {
    alert('Введите заголовок')
  }
  clearRefs()
}

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

watch(dateValue, () => {
  itemDate.value = +new Date(
    dateValue.value?.year!,
    dateValue.value?.month! - 1,
    dateValue.value?.day
  )
})

watch(deadlineValue, () => {
  itemDeadline.value = +new Date(
    deadlineValue.value?.year!,
    deadlineValue.value?.month! - 1,
    deadlineValue.value?.day
  )
})

declare module 'mousetrap' {
  interface MousetrapInstance {
    bindGlobal(
      keys: string | string[],
      callback: (e: KeyboardEvent, combo: string) => void,
      action?: string
    ): void
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
  const mousetrap = new Mousetrap()

  const bindings: {
    keys: string | string[]
    guard: () => boolean
    action: (e: KeyboardEvent, key?: string) => void
  }[] = [
    {
      keys: ['esc'],
      guard: () => isShowForm.value,
      action: () => {
        isShowForm.value = false
        clearRefs()
      },
    },
    {
      keys: ['command+j', 'command+о'],
      guard: () => !isShowForm.value,
      action: () => {
        isShowForm.value = true
        showForm()
      },
    },
  ]

  for (const { keys, guard, action } of bindings) {
    mousetrap.bindGlobal(keys, withGuard(guard, action))
  }

  onUnmounted(() => {
    mousetrap.reset()
  })
})
</script>

<template>
  <div
    class="add-item-wrapper-inline"
    @keypress.enter="handleSubmit"
  >
    <Tooltip>
      <Transition
        name="fade-form"
        mode="out-in"
      >
        <div
          v-if="!isShowForm"
          key="component-a"
          class="item-entity pt-2 pb-2 item-entity__show-form-button"
          @click="showForm"
        >
          <Checkbox
            v-if="itemType !== 'note'"
            class="item-checkbox"
            :disabled="true"
          />
          Add {{ itemType }}
        </div>
        <div
          v-else
          key="component-b"
          class="item-entity pt-2 pb-2"
        >
          <Checkbox
            v-if="itemType !== 'note'"
            class="item-checkbox"
            :style="
              (itemPriority === 1 && 'border: 2px solid red') ||
              (itemPriority === 2 && 'border: 2px solid orange') ||
              (itemPriority === 3 && 'border: 2px solid blue')
            "
            :disabled="true"
          />
          <div class="item-entity__column">
            <div class="item-entity__title">
              <input
                v-model="itemTitle"
                type="text"
                placeholder="Enter title"
                class="item-title__input"
                ref="inputRef"
              />
            </div>
            <div class="item-entity__description">
              <input
                v-model="itemDescription"
                type="text"
                placeholder="Enter description"
                class="item-description__input"
              />
            </div>
            <div class="item-entity__params">
              <div class="item-entity__param">
                <Popover>
                  <PopoverTrigger as-child>
                    <Badge
                      :variant="dateValue ? 'secondary' : 'outline'"
                      :class="
                        cn(
                          'justify-start text-left font-normal',
                          !dateValue && 'text-muted-foreground'
                        )
                      "
                    >
                      {{ dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Date' }}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
                    <Calendar v-model="dateValue" />
                  </PopoverContent>
                </Popover>
              </div>
              <div class="item-entity__param">
                <Popover>
                  <PopoverTrigger as-child>
                    <Badge
                      :variant="deadlineValue ? 'secondary' : 'outline'"
                      :class="
                        cn(
                          'justify-start text-left font-normal',
                          !deadlineValue && 'text-muted-foreground'
                        )
                      "
                    >
                      {{
                        deadlineValue
                          ? df.format(deadlineValue.toDate(getLocalTimeZone()))
                          : 'Deadline'
                      }}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
                    <Calendar v-model="deadlineValue" />
                  </PopoverContent>
                </Popover>
              </div>
              <div class="item-entity__param">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Badge
                      :variant="itemPriority ? 'secondary' : 'outline'"
                      :class="
                        cn(
                          'flex justify-start text-left font-normal',
                          !itemPriority && 'text-muted-foreground'
                        )
                      "
                    >
                      {{ itemPriority ? itemPriority : 'Priority' }}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      :modelValue="itemPriority?.toString()"
                      @update:modelValue="
                        (value) =>
                          value === '0' ? (itemPriority = null) : (itemPriority = Number(value))
                      "
                    >
                      <DropdownMenuRadioItem value="1">High</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="2">Medium</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="3">Low</DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="0">No priority</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div class="item-entity__param">
                <Badge
                  :variant="durationPlannedValue ? 'secondary' : 'outline'"
                  :class="
                    cn(
                      'justify-start text-left font-normal',
                      !durationPlannedValue && 'text-muted-foreground'
                    )
                  "
                >
                  <input
                    v-model="durationPlannedValue"
                    placeholder="e.g. 2h 32m"
                    class="item-description__input"
                  />
                </Badge>
              </div>
            </div>
          </div>
          <TooltipTrigger as-child>
            <span class="checkbox-icon-toggle item-entity__options">
              <X
                class="h-4 w-4 transition-transform duration-75"
                @click="isShowForm = false"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm text-muted-foreground">
              Press
              <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
              >
                <span class="text-xs">Esc</span>
              </kbd>
              to close
            </p>
          </TooltipContent>
        </div>
      </Transition>
    </Tooltip>
  </div>
</template>

<style lang="scss">
.item-entity {
  position: relative;
  // border: none;

  &__show-form-button {
    color: hsl(var(--muted-foreground));
    border-bottom: 1px solid hsl(var(--border));
    cursor: pointer;
    transition: 0.1s;

    &:hover {
      border-color: hsl(var(--muted-foreground));
    }
  }

  &__description input {
    font-size: 15px;
    color: hsl(var(--muted-foreground));
  }

  &__param {
    display: flex;
    max-width: 8rem;
    cursor: pointer;
  }

  &__options {
    position: absolute;
    right: -0rem;
    top: 12px;
    display: flex;
  }
}

.fade-form-move,
.fade-form-enter-active,
.fade-form-leave-active {
  transition:
    opacity 0.05s cubic-bezier(0.55, 0, 0.1, 1),
    transform 0.05s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-form-enter-from,
.fade-form-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-form-leave-active {
  position: absolute;
  width: 100%;
}
</style>
