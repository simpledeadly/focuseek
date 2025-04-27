<script setup lang="ts">
import { ref, watch } from 'vue'
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

const { itemType } = useItemType()

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
  itemTitle.value = ''
  itemDescription.value = null
  itemDeadline.value = undefined
  itemDate.value = undefined
  itemPriority.value = null
  dateValue.value = undefined
  deadlineValue.value = undefined
  durationPlannedValue.value = null
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
</script>

<template>
  <div
    class="add-item-wrapper-inline"
    @keypress.enter="handleSubmit"
  >
    <div class="item-entity pt-2 pb-2">
      <Checkbox
        class="item-checkbox"
        v-if="itemType !== 'note'"
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
                    cn('justify-start text-left font-normal', !dateValue && 'text-muted-foreground')
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
                    deadlineValue ? df.format(deadlineValue.toDate(getLocalTimeZone())) : 'Deadline'
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
    </div>
  </div>
</template>

<style lang="scss">
.add-item-wrapper-inline {
  .item-entity {
    border: none;

    &__description input {
      font-size: 15px;
      color: hsl(var(--muted-foreground));
    }

    &__param {
      display: flex;
      max-width: 8rem;
      cursor: pointer;
    }
  }
}
</style>
