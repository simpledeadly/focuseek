<script setup lang="ts">
import { ref, watch } from 'vue'
import { Badge } from '@/shared/ui/badge'
import { Calendar } from '@/shared/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'
import { useItemType } from '../../filter'
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { Checkbox } from '@/shared/ui/checkbox'

const emit = defineEmits<{
  (
    e: 'submit',
    data: {
      itemTitle: string
      parentId?: number
      description?: string
      deadline?: number
      date?: number
      priority?: number
      durationPlanned?: number
    }
  ): void
}>()

const itemTitle = ref<string>('')
const itemDescription = ref<string>('')
const itemDeadline = ref<number>()
const itemDate = ref<number>()
const itemParentId = ref<number>()
const itemPriority = ref<number>()
const itemDurationPlanned = ref<number>()

const dateValue = ref<DateValue>()
const deadlineValue = ref<DateValue>()

const { itemType } = useItemType()

const handleSubmit = () => {
  if (itemTitle.value.length > 0) {
    const data = {
      itemTitle: itemTitle.value,
      parentId: Number(itemParentId.value),
      description: itemDescription.value,
      deadline: Number(itemDeadline.value),
      date: Number(itemDate.value),
      priority: Number(itemPriority.value),
      durationPlanned: Number(itemDurationPlanned.value),
    }
    emit('submit', data)
  } else {
    alert('Введите заголовок')
  }
  itemTitle.value = ''
  itemDescription.value = ''
  itemDeadline.value = undefined
  itemDate.value = undefined
  itemPriority.value = undefined
  itemDurationPlanned.value = undefined
  dateValue.value = undefined
  deadlineValue.value = undefined
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
                  @update:modelValue="(value) => (itemPriority = Number(value))"
                >
                  <DropdownMenuRadioItem value="1">High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="2">Medium</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="3">Low</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="0"> No priority </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div class="item-entity__param">
            <Badge variant="outline">
              <input
                v-model="itemDurationPlanned"
                type="number"
                placeholder="Duration"
                class="font-normal"
                style="width: 4rem"
              />
            </Badge>
          </div>
          <div class="item-entity__param">
            <Badge variant="outline">
              <input
                v-model="itemParentId"
                type="number"
                placeholder="pID"
                class="font-normal"
                style="width: 3rem"
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
