<script setup lang="ts">
import { Checkbox } from '@/shared/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'

const model = defineModel<boolean>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Checkbox
          v-model="model"
          class="item-checkbox"
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>Mark as done</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style lang="scss">
.item-checkbox {
  border-radius: 100%;
}
</style>
