<script setup lang="ts">
import { ref, watch } from 'vue'
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
  (e: 'edit-date', value: number | undefined): void
  (e: 'edit-deadline', value: number | undefined): void
  (e: 'edit-priority', value: number | undefined): void
  (e: 'change-collection', value: number): void
}>()

const dateValue = ref<DateValue>()
const deadlineValue = ref<DateValue>()
const isMenuOpen = ref(false)
const priority = ref(props.item.priority)
const collectionId = ref(props.item.collectionId)

watch(collectionId, (newVal) => {
  if (newVal) {
    modelCollectionId.value = collectionId.value
    emit('change-collection', modelCollectionId.value)
    isMenuOpen.value = false
  }
})

watch(priority, (newVal) => {
  if (newVal) {
    modelPriority.value = priority.value
    emit('edit-priority', modelPriority.value)
    isMenuOpen.value = false
  }
})

watch(dateValue, (newVal) => {
  if (newVal) {
    const newDate = new Date(newVal.year, newVal.month - 1, newVal.day).getTime()
    modelDate.value = newDate
    emit('edit-date', newDate)
    isMenuOpen.value = false
  }
})

watch(deadlineValue, (newVal) => {
  if (newVal) {
    const newDeadline = new Date(newVal.year, newVal.month - 1, newVal.day).getTime()
    modelDeadline.value = newDeadline
    emit('edit-deadline', newDeadline)
    isMenuOpen.value = false
  }
})

const handleRemoveDate = () => {
  modelDate.value = undefined
  dateValue.value = undefined
  emit('edit-date', modelDate.value)
}

const handleRemoveDeadline = () => {
  modelDeadline.value = undefined
  deadlineValue.value = undefined
  emit('edit-deadline', modelDeadline.value)
}
</script>

<template>
  <DropdownMenu v-model:open="isMenuOpen">
    <DropdownMenuTrigger as-child>
      <div class="item-show-options">
        <span class="checkbox-icon-toggle">
          <Ellipsis class="h-4 w-4 transition-transform duration-100" />
        </span>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-48">
      <DropdownMenuGroup>
        <DropdownMenuItem
          v-if="!props.item.description"
          @click="emit('add-description')"
        >
          <span>Add description</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          v-else
          @click="emit('remove-description')"
        >
          <span>Remove description</span>
        </DropdownMenuItem>
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
          @click="handleRemoveDate"
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
          @click="handleRemoveDeadline"
        >
          <span>Remove deadline</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>{{ item.priority ? 'Edit priority' : 'Set priority' }}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                :modelValue="priority?.toString()"
                @update:modelValue="(value) => (priority = Number(value))"
              >
                <DropdownMenuRadioItem value="1">High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="2">Medium</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3">Low</DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem
                  value="0"
                  @click="emit('edit-priority', 0)"
                >
                  No priority
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Switch collection</span>
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
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="emit('remove')">
        <span>Delete</span>
        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
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
