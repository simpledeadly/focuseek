<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { ChevronRight } from 'lucide-vue-next'

const model = defineModel<boolean>()
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <div class="item-show-sub-items">
        <label class="checkbox-icon-toggle-wrap">
          <input
            type="checkbox"
            v-model="model"
            class="visually-hidden"
          />
          <span class="checkbox-icon-toggle">
            <ChevronRight
              class="h-4 w-4 transition-transform duration-100"
              :class="{ 'rotate-90': model }"
            />
          </span>
        </label>
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>Show sub-items</p>
    </TooltipContent>
  </Tooltip>
</template>

<style lang="scss">
.item-show-sub-items {
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

.checkbox-icon-toggle-wrap {
  cursor: pointer;
}

.rotate-90 {
  transform: rotate(90deg);
}

.transition-transform {
  transition: transform 0.1s ease;
}
</style>
