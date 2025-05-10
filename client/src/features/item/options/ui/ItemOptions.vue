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
import { type DateValue } from '@internationalized/date'
import { Ellipsis } from 'lucide-vue-next'
import { useItemOptionsShortcuts } from '../model/useItemOptionsShortcuts'
import { Input } from '@/shared/ui/input'
import { parseDurationToUnixTimestamp } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import ItemRemoveOption from './ItemRemoveOption.vue'
import ItemDateOptions from './ItemDateOptions.vue'
import ItemPriorityOption from './ItemPriorityOption.vue'

const modelDate = defineModel<number>('date')
const modelDeadline = defineModel<number>('deadline')
const modelPriority = defineModel<number>('priority')
const modelCollectionId = defineModel<number>('collectionId')

const props = defineProps<{
  item: Item
  collections: Collection[]
  hasSubItems: boolean
}>()

const emit = defineEmits<{
  (e: 'remove'): void
  (e: 'add-description'): void
  (e: 'remove-description'): void
  (e: 'open-details-page'): void
  (e: 'change-date', value: number | undefined): void
  (e: 'change-deadline', value: number | undefined): void
  (e: 'change-priority', value: number | null): void
  (e: 'switch-collection', value: number): void
  (e: 'switch-user', value: { userId: number; colId: number }): void
  (e: 'switch-type'): void
  (e: 'change-duration-planned', value: number | null): void
  (e: 'remove-timer'): void
  (e: 'reset-timer'): void
  (e: 'toggle-sub-item-form'): void
}>()

const dateValue = ref<DateValue>()
const deadlineValue = ref<DateValue>()
const isMenuOpen = ref(false)
const isMenuSubOpen = ref(false)
const isConfirmOpen = ref(false)
const inputValue = ref<string>()
const userIdValue = ref<number>()
const colIdValue = ref<number>()
const priority = ref(props.item.priority)
const collectionId = ref(props.item.collectionId)

const dropdownRef = ref<HTMLElement | null>(null)

useItemOptionsShortcuts({
  dropdownRef,
  isMenuOpen,
  isMenuSubOpen,
  isConfirmOpen,
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

watchAndEmit(collectionId, 'switch-collection', modelCollectionId, isMenuOpen)
watchAndEmit(priority, 'change-priority', modelPriority, isMenuOpen)
watchAndEmit(dateValue, 'change-date', modelDate, isMenuOpen, (val) =>
  new Date(val.year, val.month - 1, val.day).getTime()
)
watchAndEmit(deadlineValue, 'change-deadline', modelDeadline, isMenuOpen, (val) =>
  new Date(val.year, val.month - 1, val.day).getTime()
)

const handleRemove = (emitTitle: any, modelValue: number | undefined | null) => {
  console.log(emitTitle, modelValue)
  modelValue = null
  emit(emitTitle, modelValue)
  isMenuOpen.value = false
}

const handleChangeDuration = async () => {
  if (inputValue.value !== undefined && inputValue.value.length >= 0) {
    emit('change-duration-planned', parseDurationToUnixTimestamp(inputValue.value))
    inputValue.value = ''
    isMenuOpen.value = false
  } else {
    const msg = 'Введите время в формате 1h 1m 1s'
    alert(msg)
    console.log(msg)
  }
}

const handleSwitchUser = () => {
  if (
    userIdValue.value !== undefined &&
    userIdValue.value >= 0 &&
    colIdValue.value !== undefined &&
    colIdValue.value >= 0
  ) {
    emit('switch-user', { userId: userIdValue.value, colId: colIdValue.value })
    userIdValue.value = 7
    colIdValue.value = 11
    isMenuOpen.value = false
  } else {
    const msg = 'Заполните все поля указанными числами, иначе элемент потеряется!'
    alert(msg)
    console.log(msg)
  }
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
        <ItemDateOptions
          label="date"
          :value="item.date"
          v-model="dateValue"
          @remove="handleRemove('change-date', modelDate)"
        />
        <ItemDateOptions
          label="deadline"
          :value="item.deadline"
          v-model="deadlineValue"
          @remove="handleRemove('change-deadline', modelDeadline)"
        />
        <ItemPriorityOption
          :priority="item.priority"
          v-model:isMenuSubOpen="isMenuSubOpen"
          @change-priority="emit('change-priority', $event)"
        />
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

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Switch user</span>
            <DropdownMenuShortcut>Dev</DropdownMenuShortcut>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Input
                type="number"
                v-model="userIdValue"
                placeholder="Type number 7/9"
              />
              <Input
                type="number"
                class="mt-1"
                v-model="colIdValue"
                placeholder="Type number 8/11"
              />
              <Button
                variant="outline"
                class="mt-1 w-full"
                @click="handleSwitchUser"
                @keydown.enter="handleSwitchUser"
                :disabled="!userIdValue || !colIdValue"
                >Switch</Button
              >
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
          v-if="!props.item.showSubItems && !hasSubItems"
          @click="emit('toggle-sub-item-form')"
        >
          <span>Add subitem form</span>
          <DropdownMenuShortcut>S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          v-if="props.item.showSubItems && !hasSubItems"
          @click="emit('toggle-sub-item-form')"
        >
          <span>Remove subitem form</span>
          <DropdownMenuShortcut>S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>{{ !props.item.durationPlanned ? 'Set duration' : 'Change duration' }}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <Input
                type="text"
                v-model="inputValue"
                placeholder="e.g. 1h 23m 45s"
                @keydown.enter="handleChangeDuration"
              />
              <Button
                variant="outline"
                class="mt-1 w-full"
                @click="handleRemove('change-duration-planned', null)"
                :disabled="!props.item.durationPlanned"
                >Remove</Button
              >
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          @click="emit('reset-timer')"
          :disabled="
            props.item.durationReal === 0 ||
            (props.item.durationReal === null && !!props.item.durationPlanned)
          "
        >
          <span>{{
            props.item.durationReal === null && !props.item.durationPlanned
              ? 'Add stopwatch'
              : 'Reset stopwatch'
          }}</span>
          <DropdownMenuShortcut>{{
            props.item.durationReal === null ? 'E' : '⇧E'
          }}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          v-if="props.item.durationReal !== null || props.item.durationPlanned"
          @click="emit('remove-timer')"
        >
          <span>Remove stopwatch</span>
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem @click="emit('switch-type')">
          <span>Switch to {{ props.item.type === 'todo' ? 'note' : 'todo' }}</span>
          <DropdownMenuShortcut>T</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <ItemRemoveOption
        v-model="isConfirmOpen"
        @remove="emit('remove')"
      />
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
