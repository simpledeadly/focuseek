<script setup lang="ts">
import { toRef } from 'vue'
import { toast } from 'vue-sonner'
import { Checkbox } from '@/shared/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { checkboxStyle } from '../../composables'

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
        no-tick
      />
    </TooltipTrigger>
    <TooltipContent>
      <p>{{ model ? 'Undone' : 'Done' }}</p>
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
