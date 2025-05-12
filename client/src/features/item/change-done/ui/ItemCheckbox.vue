<script setup lang="ts">
import { h, toRef } from 'vue'
import { toast } from 'vue-sonner'
import { Checkbox } from '@/shared/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { parseUnixTimestampToDuration } from '@/shared/lib/utils'
import { checkboxStyle } from '../../composables'

const model = defineModel<boolean>()

const props = defineProps<{
  itemId: number
  priority?: number | null
  disabled?: boolean
}>()

const storedValue = localStorage.getItem(`timer_${props.itemId}`)

const toaster = () => {
  toast.success('Todo completed', {
    description: h('div', { class: 'text-muted-foreground' }, [
      storedValue ? '+1 in ' : '+1',
      h(
        'span',
        { class: 'text-foreground' },
        storedValue
          ? `${parseUnixTimestampToDuration(JSON.parse(storedValue).trackedDuration)}`
          : ''
      ),
    ]),
    class: 'toast',
    duration: 5000,
  })
}

const style = checkboxStyle(toRef(props, 'priority'), model)
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <Checkbox
        class="item-checkbox"
        v-model="model"
        @click="!model && toaster()"
        :style="style"
        :disabled="props.disabled"
      />
    </TooltipTrigger>
    <TooltipContent>
      <p>{{ `Mark as ${model ? 'undone' : 'done'}` }}</p>
    </TooltipContent>
  </Tooltip>
</template>

<style lang="scss">
.item-checkbox {
  border-radius: 100%;
  border-style: solid;
  transition: all 0.05s linear;

  &:disabled {
    margin-top: 4px;
  }
}
</style>
