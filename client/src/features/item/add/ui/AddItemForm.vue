<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { useItemType } from '@/features/item/filter'
import { capitalizeAndAppendS } from '@/shared/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { CirclePlus } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'submit', value: string): void
}>()

const slots = defineSlots<{
  select?: () => unknown
}>()

const itemTitle = ref<string>('')
const { itemType } = useItemType()

const handleSubmit = () => {
  if (itemTitle.value.length > 0) {
    emit('submit', itemTitle.value)
  } else {
    alert('Введите заголовок')
  }
  itemTitle.value = ''
}
</script>

<template>
  <div class="add-item-wrapper">
    <div class="flex w-full max-w-sm items-center gap-1.5">
      <form
        class="add-item-form"
        @submit.prevent="handleSubmit"
      >
        <Input
          v-model="itemTitle"
          type="text"
          :placeholder="`Enter ${itemType}'s title`"
          class="add-item-form__input"
        />
        <slot
          v-if="slots.select"
          name="select"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                type="button"
                variant="secondary"
                class="add-item-form__input-button"
                @click="handleSubmit"
              >
                <CirclePlus class="w-4 h-4" />
                <!-- Add -->
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new {{ itemType }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
    <Separator :label="capitalizeAndAppendS(itemType)" />
  </div>
</template>

<style lang="scss">
.add-item-wrapper {
  margin-bottom: 1.5rem;
}

.add-item-form {
  display: flex;
  margin: 0 auto;
  margin-bottom: 1.5rem;

  &__input {
    // margin-right: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    &-button {
      border: 1px solid hsl(var(--border));
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
