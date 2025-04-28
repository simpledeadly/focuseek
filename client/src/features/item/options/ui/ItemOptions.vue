<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { Item } from '@/entities/item'
import { Collection } from '@/entities/collection'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Calendar } from '@/shared/ui/calendar'
import { type DateValue } from '@internationalized/date'
import { Ellipsis } from 'lucide-vue-next'
import { useItemOptionsShortcuts } from '../model/useItemOptionsShortcuts'

const modelDate = defineModel<number>('date')
const modelDeadline = defineModel<number>('deadline')
const modelPriority = defineModel<number>('priority')
const modelCollectionId = defineModel<number>('collectionId')

const props = defineProps<{
  item: Item
  collections: Collection[]
}>()

const emit = defineEmits<{
  (e: 'remove'): void
  (e: 'add-description'): void
  (e: 'remove-description'): void
  (e: 'open-details-page'): void
  (e: 'edit-date', value: number | undefined): void
  (e: 'edit-deadline', value: number | undefined): void
  (e: 'edit-priority', value: number | null): void
  (e: 'change-collection', value: number): void
  (e: 'change-type'): void
  (e: 'change-duration-planned', value: number | null): void
  (e: 'change-duration-real', value: number | null): void
  (e: 'change-duration-real-from-opitons', value: number | null): void
}>()

const dateValue = ref<DateValue>()
const deadlineValue = ref<DateValue>()
const isMenuOpen = ref(false)
const priority = ref(props.item.priority)
const collectionId = ref(props.item.collectionId)

const dropdownRef = ref<HTMLElement | null>(null)

useItemOptionsShortcuts({
  dropdownRef,
  isMenuOpen,
  priority,
  modelPriority,
  props,
  emit,
})

const watchAndEmit = <T, U = T>(
  src: Ref<T | undefined>,
  emitTitle: any,
  model: Ref<U | undefined>,
  isMenuOpen: Ref<boolean>,
  transform?: (val: T) => U
) => {
  watch(src, (newVal) => {
    if (!newVal) return
    const valueToEmit: any = transform ? transform(newVal) : (newVal as unknown as U)
    model.value = valueToEmit
    emit(emitTitle, valueToEmit)
    isMenuOpen.value = false
  })
}

watchAndEmit(collectionId, 'change-collection', modelCollectionId, isMenuOpen)
watchAndEmit(priority, 'edit-priority', modelPriority, isMenuOpen)
watchAndEmit(dateValue, 'edit-date', modelDate, isMenuOpen, (val) =>
  new Date(val.year, val.month - 1, val.day).getTime()
)
watchAndEmit(deadlineValue, 'edit-deadline', modelDeadline, isMenuOpen, (val) =>
  new Date(val.year, val.month - 1, val.day).getTime()
)

const handleRemove = (emitTitle: any, modelValue: number | undefined) => {
  modelValue = undefined
  emit(emitTitle, modelValue)
}
</script>

<template>
  <DropdownMenu
    v-model:open="isMenuOpen"
    ref="dropdownRef"
  >
    <DropdownMenuTrigger as-child>
      <div
        class="item-show-options"
        :style="isMenuOpen && 'background: hsl(var(--border))'"
      >
        <span class="checkbox-icon-toggle">
          <Ellipsis class="h-4 w-4 transition-transform duration-75" />
        </span>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-48">
      <DropdownMenuGroup>
        <DropdownMenuSub v-if="!item.date">
          <DropdownMenuSubTrigger>
            <span>Set date</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Calendar v-model="dateValue" />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          v-else
          @click="handleRemove('edit-date', modelDate)"
        >
          <span>Remove date</span>
        </DropdownMenuItem>
        <DropdownMenuSub v-if="!item.deadline">
          <DropdownMenuSubTrigger>
            <span>Set deadline</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Calendar v-model="deadlineValue" />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          v-else
          @click="handleRemove('edit-deadline', modelDeadline)"
        >
          <span>Remove deadline</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>{{ item.priority ? 'Edit priority' : 'Set priority' }}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent class="w-40">
              <DropdownMenuRadioGroup
                :modelValue="priority?.toString()"
                @update:modelValue="
                  (value) => (value === '0' ? (priority = null) : (priority = Number(value)))
                "
              >
                <DropdownMenuRadioItem value="1">
                  High
                  <DropdownMenuShortcut>
                    <DropdownMenuShortcut>F</DropdownMenuShortcut>
                    1
                  </DropdownMenuShortcut>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="2">
                  Medium
                  <DropdownMenuShortcut>
                    <DropdownMenuShortcut>F</DropdownMenuShortcut>
                    2
                  </DropdownMenuShortcut>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3">
                  Low
                  <DropdownMenuShortcut>
                    <DropdownMenuShortcut>F</DropdownMenuShortcut>
                    3
                  </DropdownMenuShortcut>
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem
                  value="0"
                  @click="emit('edit-priority', null)"
                >
                  No priority
                  <DropdownMenuShortcut>
                    <DropdownMenuShortcut>F</DropdownMenuShortcut>
                    4
                  </DropdownMenuShortcut>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Move to</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                :modelValue="collectionId?.toString()"
                @update:modelValue="(value) => (collectionId = Number(value))"
              >
                <DropdownMenuRadioItem
                  v-for="col in props.collections"
                  :value="col.id.toString()"
                >
                  {{ col.title }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem @click="emit('open-details-page')">
          <span>Open</span>
          <DropdownMenuShortcut>G</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          v-if="props.item.description === null"
          @click="emit('add-description')"
        >
          <span>Add description</span>
          <DropdownMenuShortcut>D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          v-else
          @click="emit('remove-description')"
        >
          <span>Remove description</span>
          <DropdownMenuShortcut>D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          @click="emit('change-duration-real-from-opitons', 0)"
          :disabled="
            props.item.durationReal === 0 ||
            (props.item.durationReal === null && !!props.item.durationPlanned)
          "
        >
          <span>{{
            props.item.durationReal === null && !props.item.durationPlanned
              ? 'Add tracking'
              : 'Reset stopwatch'
          }}</span>
          <DropdownMenuShortcut>{{
            props.item.durationReal === null ? 'E' : '⇧S'
          }}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          v-if="props.item.durationReal !== null || props.item.durationPlanned"
          @click="emit('change-duration-real-from-opitons', null)"
        >
          <span>Remove stopwatch</span>
          <DropdownMenuShortcut>⇧E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem @click="emit('change-type')">
          <span>Turn into {{ props.item.type === 'todo' ? 'note' : 'todo' }}</span>
          <DropdownMenuShortcut>T</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="emit('remove')">
        <span>Delete</span>
        <DropdownMenuShortcut>R</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style lang="scss">
.item-show-options {
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 4px;

  &:hover {
    color: hsl(var(--primary));
    background: hsl(var(--border));
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.checkbox-icon-toggle {
  cursor: pointer;
}
</style>
