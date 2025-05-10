<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu'
import { ref } from 'vue'
import { watch } from 'vue'

const emit = defineEmits<{
  (e: 'change-priority', value: number | null): void
}>()

const props = defineProps<{
  priority?: number | null
}>()

const isMenuSubOpen = defineModel<boolean>('isMenuSubOpen')

const priorityModel = ref<number | null>(props.priority ?? null)

watch(
  () => props.priority,
  (newPriority) => {
    if (newPriority !== priorityModel.value) {
      priorityModel.value = newPriority ?? null
    }
  }
)

watch(priorityModel, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== props.priority) {
    emit('change-priority', newVal)
  }
})
</script>

<template>
  <DropdownMenuSub v-model:open="isMenuSubOpen">
    <DropdownMenuSubTrigger>
      <span>{{ props.priority ? 'Change priority' : 'Set priority' }}</span>
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent class="w-40">
        <DropdownMenuRadioGroup
          :modelValue="priorityModel?.toString()"
          @update:modelValue="
            (value: string) => (priorityModel = value === '0' ? null : Number(value))
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
          <DropdownMenuRadioItem value="0">
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
</template>
