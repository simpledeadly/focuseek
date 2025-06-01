<script setup lang="ts">
import { capitalize, ref, watch } from 'vue'
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
import { useCollections } from '@/entities/collection'
import { ItemType } from '@/entities/item'
import { checkboxStyle } from '../../composables'

import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/shared/ui/combobox'
import { Check, RefreshCcw, Search } from 'lucide-vue-next'

const { collections, findIdByCollectionTitle, findCollectionTitleById } = useCollections()

const emit = defineEmits<{
  (
    e: 'submit',
    data: {
      collectionId: number
      itemTitle: string
      itemType: ItemType
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

const itemTitle = ref<string>('')
const itemDescription = ref<string | null>('')
const itemDeadline = ref<number>()
const itemDate = ref<number>()
const itemParentId = ref<number | null>()
const itemPriority = ref<number | null>()
const itemTypeValue = ref<ItemType>('todo')
const itemCollectionId = ref<number>(findIdByCollectionTitle('Inbox') || 0)

const dateValue = ref<DateValue>()
const deadlineValue = ref<DateValue>()
const durationPlannedValue = ref<string | null>()
const tagValue = ref<string | null>()
const tag2Value = ref<string | null>()
const tag3Value = ref<string | null>()

const inputRef = ref<HTMLInputElement | null>(null)

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
      collectionId: itemCollectionId.value,
      itemTitle: itemTitle.value,
      itemType: itemTypeValue.value as ItemType,
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

const style = checkboxStyle(itemPriority)
</script>

<template>
  <div
    class="add-item-wrapper-inline"
    @keypress.enter="handleSubmit"
  >
    <Transition
      name="fade-form"
      mode="default"
    >
      <div class="item-entity p-2 rounded-md">
        <Checkbox
          v-if="itemTypeValue !== 'note'"
          class="item-checkbox"
          :style="style"
          @click="itemTypeValue === 'todo' ? (itemTypeValue = 'note') : (itemTypeValue = 'todo')"
          :disabled="true"
        />
        <div class="item-entity__column">
          <div class="item-entity__title">
            <input
              v-model="itemTitle"
              type="text"
              name="title"
              placeholder="Enter title"
              class="item-title__input"
              ref="inputRef"
            />
          </div>
          <div class="item-entity__description">
            <input
              v-model="itemDescription"
              type="text"
              name="description"
              placeholder="Enter description"
              class="item-description__input"
            />
          </div>
          <div class="item-entity__params">
            <div
              class="item-entity__param"
              @click="
                itemTypeValue === 'todo' ? (itemTypeValue = 'note') : (itemTypeValue = 'todo')
              "
            >
              <Badge
                :variant="itemTypeValue ? 'secondary' : 'outline'"
                :class="
                  cn(
                    'justify-start text-left font-normal flex cursor-pointer w-full',
                    !itemTypeValue && 'text-muted-foreground'
                  )
                "
              >
                {{ capitalize(itemTypeValue) }}
              </Badge>
            </div>
            <div class="item-entity__param">
              <Combobox
                v-model="itemCollectionId"
                :items="collections"
                item-text="title"
                item-value="id"
              >
                <ComboboxAnchor as-child>
                  <ComboboxTrigger as-child>
                    <Badge
                      :variant="itemCollectionId ? 'secondary' : 'outline'"
                      :class="
                        cn(
                          'justify-start text-left font-normal flex cursor-pointer w-full',
                          !itemCollectionId && 'text-muted-foreground'
                        )
                      "
                    >
                      {{ findCollectionTitleById(itemCollectionId) || 'List' }}</Badge
                    >
                  </ComboboxTrigger>
                </ComboboxAnchor>

                <ComboboxList>
                  <div class="relative w-full max-w-sm items-center">
                    <ComboboxInput
                      class="pl-9 focus-visible:ring-0 border-0 border-b rounded-none h-10"
                      placeholder="Select list..."
                      :model-value="''"
                    />
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                      <Search class="size-4 text-muted-foreground" />
                    </span>
                  </div>

                  <ComboboxEmpty>No list found.</ComboboxEmpty>

                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="collection in collections"
                      :key="collection.id"
                      :value="collection.id"
                    >
                      {{ collection.title }}

                      <ComboboxItemIndicator>
                        <Check :class="cn('ml-auto h-4 w-4')" />
                      </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
            </div>
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
                  name="durPlan"
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
                  name="tag"
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
                  name="tag2"
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
                  name="tag3"
                  placeholder="Tag"
                  class="item-description__input item-entity__input-tag"
                />
              </Badge>
            </div>
            <div class="item-entity__param">
              <Badge
                variant="outline"
                :class="
                  cn(
                    'justify-start text-left font-normal cursor-not-allowed',
                    itemTitle.length > 0 && 'text-muted-foreground cursor-pointer'
                  )
                "
              >
                <RefreshCcw
                  class="size-4"
                  :class="cn('text-muted-foreground', itemTitle.length > 0 && 'text-foreground')"
                  @click="clearRefs"
                />
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.item-entity {
  position: relative;
  border: 1px solid hsl(var(--border));

  &__show-form-button {
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    transition: 0.1s;
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

  &__input {
    &-durPlan {
      width: 60px;
    }

    &-tag {
      width: 80px;
    }
  }
}

.fade-form-move,
.fade-form-enter-active,
.fade-form-leave-active {
  transition:
    opacity 0.1s cubic-bezier(0.55, 0, 0.1, 1),
    transform 0.1s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-form-enter-from,
.fade-form-leave-to {
  opacity: 0;
}

.fade-form-leave-active {
  position: absolute;
  width: 70vw;
}
</style>
