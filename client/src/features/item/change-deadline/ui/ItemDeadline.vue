<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date'
import { Calendar } from '@/shared/ui/calendar'
import { Button } from '@/shared/ui/button'

const emit = defineEmits<{
  (e: 'change', value: number | undefined): void
}>()

const model = defineModel<number>()
const deadlineValue = ref<DateValue>()

const df = new DateFormatter('ru-RU', {
  dateStyle: 'long',
})

onMounted(() => {
  if (model.value) {
    const date = new Date(model.value)
    deadlineValue.value = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }
})

watch(deadlineValue, (newVal) => {
  if (newVal) {
    model.value = new Date(newVal.year, newVal.month - 1, newVal.day).getTime()
  } else {
    model.value = undefined
  }
})

const handleSaveChanges = () => {
  if (model.value) {
    model.value = undefined
    deadlineValue.value = undefined
    emit('change', model.value)
  }
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Badge
        :variant="model ? 'secondary' : 'outline'"
        :class="
          cn('justify-start text-left font-normal', !deadlineValue && 'text-muted-foreground')
        "
      >
        {{ deadlineValue ? df.format(deadlineValue.toDate(getLocalTimeZone())) : 'Deadline' }}
      </Badge>
    </PopoverTrigger>
    <PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
      <Calendar
        v-model="deadlineValue"
        @click="emit('change', model)"
      />
      <Button
        @click="handleSaveChanges"
        :variant="model ? 'secondary' : 'outline'"
      >
        Clear
      </Button>
    </PopoverContent>
  </Popover>
</template>

<style lang="scss">
.item-date {
  display: flex;
  cursor: pointer;
  color: hsl(var(--muted-foreground));
  font-weight: normal;
}
</style>
