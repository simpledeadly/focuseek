<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
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
import { ItemType } from '@/entities/item'
import { checkboxStyle } from '../../composables'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  subForm?: boolean
}>()

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
      tags?: string[]
    }
  ): void
}>()

const itemType = defineModel<ItemType>('type')
const isShowForm = defineModel<boolean>('isExpand')

const itemTitle = ref<string>('')
const itemDescription = ref<string | null>('')
const itemDeadline = ref<number>()
const itemDate = ref<number>()
const itemParentId = ref<number | null>()
const itemPriority = ref<number | null>()

const dateValue = ref<DateValue>()
const deadlineValue = ref<DateValue>()
const durationPlannedValue = ref<string | null>()
const tagValue = ref<string | null>()
const tag2Value = ref<string | null>()
const tag3Value = ref<string | null>()

// const isShowForm = ref<boolean>(false)
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

const clearRefs = () => {
  itemTitle.value = ''
  itemDescription.value = null
  itemDeadline.value = undefined
  itemDate.value = undefined
  itemPriority.value = null
  dateValue.value = undefined
  deadlineValue.value = undefined
  durationPlannedValue.value = null
  tagValue.value = null
  tag2Value.value = null
  tag3Value.value = null
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
      tags: [tagValue.value, tag2Value.value, tag3Value.value].filter(
        (tag): tag is string => tag !== null && tag !== undefined
      ),
    }
    emit('submit', data)
  } else {
    alert('Введите заголовок')
  }
  clearRefs()
  // isShowForm.value = false
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
      guard: () => !!isShowForm.value,
      action: () => {
        isShowForm.value = false
        clearRefs()
      },
    },
    {
      keys: ['command+i', 'command+ш'],
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

const style = checkboxStyle(itemPriority)
</script>

<template>
  <div
    class="add-item-wrapper-inline"
    @keypress.enter="handleSubmit"
  >
    <div class="item-entity-wrapper">
      <div
        class="item-entity pt-2 pb-2 item-entity__show-form-button"
        :class="{ 'item-entity__hidden': isShowForm }"
        @click="showForm"
      >
        <Checkbox
          v-if="itemType !== 'note'"
          class="item-checkbox"
          :disabled="true"
        />
        Add {{ props.subForm ? `sub${itemType}` : itemType }}
      </div>
      <Transition name="fade-form">
        <div
          v-if="isShowForm"
          class="item-entity item-entity__form-overlay"
        >
          <Checkbox
            v-if="itemType !== 'note'"
            class="item-checkbox"
            :style="style"
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
                    placeholder="1h 23m"
                    class="item-description__input item-entity__input-durPlan"
                  />
                </Badge>
              </div>
              <div class="item-entity__param">
                <Badge
                  :variant="tagValue ? 'secondary' : 'outline'"
                  :class="
                    cn('justify-start text-left font-normal', !tagValue && 'text-muted-foreground')
                  "
                >
                  <input
                    v-model="tagValue"
                    placeholder="Tag"
                    class="item-description__input item-entity__input-tag"
                  />
                </Badge>
              </div>
              <div
                v-if="tagValue"
                class="item-entity__param"
              >
                <Badge
                  :variant="tag2Value ? 'secondary' : 'outline'"
                  :class="
                    cn('justify-start text-left font-normal', !tag2Value && 'text-muted-foreground')
                  "
                >
                  <input
                    v-model="tag2Value"
                    placeholder="Tag"
                    class="item-description__input item-entity__input-tag"
                  />
                </Badge>
              </div>
              <div
                v-if="tag2Value"
                class="item-entity__param"
              >
                <Badge
                  :variant="tag3Value ? 'secondary' : 'outline'"
                  :class="
                    cn('justify-start text-left font-normal', !tag3Value && 'text-muted-foreground')
                  "
                >
                  <input
                    v-model="tag3Value"
                    placeholder="Tag"
                    class="item-description__input item-entity__input-tag"
                  />
                </Badge>
              </div>
            </div>
          </div>
          <span class="mt-2 mr-2 cursor-pointer">
            <X
              class="h-4 w-4 transition-transform duration-75"
              @click="isShowForm = false"
            />
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-item-wrapper-inline {
  position: relative;
  min-height: 40px;
  overflow: visible;
  z-index: 2;
}

.item-entity-wrapper {
  position: relative;
  width: 100%;
  overflow: visible;
}

.item-entity__show-form-button {
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: opacity 0.1s;
  padding: 8px 0;
}

.item-entity__hidden {
  opacity: 0;
  pointer-events: none;
}

.item-entity__form-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: hsl(var(--background));
  z-index: 2;
  padding: 8px 0;
  pointer-events: auto;
}

.item-entity__form-overlay * {
  pointer-events: auto;
}

.item-entity__description input {
  font-size: 15px;
  color: hsl(var(--muted-foreground));
}

.item-entity__param {
  display: flex;
  max-width: 8rem;
  cursor: pointer;
}

.fade-form-enter-active,
.fade-form-leave-active {
  transition:
    opacity 0.1s cubic-bezier(0.55, 0, 0.1, 1),
    transform 0.1s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-form-enter-from,
.fade-form-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
