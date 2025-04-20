<script setup lang="ts">
import { ref, watch } from 'vue'
import { Item } from '@/entities/item'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
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

const props = defineProps<{
  item: Item
}>()

const emit = defineEmits<{
  (e: 'remove'): void
  (e: 'add-description'): void
  (e: 'remove-description'): void
  (e: 'edit-date', value: number | undefined): void
}>()

const dateValue = ref<DateValue>()
const isMenuOpen = ref(false)

watch(dateValue, (newVal) => {
  if (newVal) {
    const newDate = new Date(newVal.year, newVal.month - 1, newVal.day).getTime()
    modelDate.value = newDate
    emit('edit-date', newDate)
    isMenuOpen.value = false
  }
})

const handleSaveChanges = () => {
  modelDate.value = undefined
  dateValue.value = undefined
  emit('edit-date', modelDate.value)
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
          @click="handleSaveChanges"
        >
          <span>Remove date</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Edit deadline</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Edit priority</span>
        </DropdownMenuItem>
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
