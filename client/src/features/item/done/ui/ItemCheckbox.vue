<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Checkbox } from '@/shared/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

const model = defineModel<boolean>()

const props = defineProps<{
  priority?: number | null
  disabled?: boolean
}>()

const toaster = () => {
  toast.success('Todo completed', {
    description: '+1',
    class: 'toast',
  })
}
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <Checkbox
        class="item-checkbox"
        v-model="model"
        @click="!model && toaster()"
        :style="
          ((props.priority === 1 && model) && 'border: 2px solid red; background: red') ||
          ((props.priority === 2 && model) && 'border: 2px solid orange; background: orange') ||
          ((props.priority === 3 && model) && 'border: 2px solid blue; background: blue') ||
          (props.priority === 1 && 'border: 2px solid red') ||
          (props.priority === 2 && 'border: 2px solid orange') ||
          (props.priority === 3 && 'border: 2px solid blue')
        "
        :disabled="props.disabled"
      />
    </TooltipTrigger>
    <TooltipContent>
      <p>Mark as done</p>
    </TooltipContent>
  </Tooltip>
</template>

<style lang="scss">
.item-checkbox {
  border-radius: 100%;

  &:disabled {
    margin-top: 4px;
  }
}
</style>
