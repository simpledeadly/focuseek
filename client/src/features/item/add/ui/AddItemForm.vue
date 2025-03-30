<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { useFilterItems, useItemType } from '@/features/item/filter'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { useItems } from '@/entities/item'

const emit = defineEmits<{
  (e: 'submit', data: { itemTitle: string; parentId?: number }): void
}>()

const slots = defineSlots<{
  select?: () => unknown
}>()

const itemTitle = ref<string>('')
const parentId = ref<number>()
const { itemType } = useItemType()

const handleSubmit = () => {
  if (itemTitle.value.length > 0) {
    const data = { itemTitle: itemTitle.value, parentId: Number(parentId.value) }
    emit('submit', data)
  } else {
    alert('Введите заголовок')
  }
  itemTitle.value = ''
  parentId.value = undefined
}

const { items } = useItems()
const { filteredItems } = useFilterItems(items)
</script>

<template>
  <div class="add-item-wrapper">
    <div class="flex items-center gap-1.5">
      <form
        class="add-item-form"
        @submit.prevent="handleSubmit"
      >
        <Input
          v-model="itemTitle"
          type="text"
          :placeholder="`Enter title`"
          class="add-item-form__input-title"
        />
        <Input
          v-model="parentId"
          type="number"
          placeholder="pID"
          class="add-item-form__input-parentId"
        />
        <slot
          v-if="slots.select"
          name="select"
        />
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              type="button"
              variant="secondary"
              class="add-item-form__input-button"
              @click="handleSubmit"
            >
              <p>Add</p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new {{ itemType }}</p>
          </TooltipContent>
        </Tooltip>
      </form>
    </div>

    <Separator
      :label="
        filteredItems.length === 0
          ? 'No ' + itemType + 's'
          : filteredItems.length + ' ' + itemType + 's'
      "
    />
  </div>
</template>

<style lang="scss">
.add-item-wrapper {
  margin-bottom: 1.5rem;
  width: 70vw;
}

.add-item-form {
  display: flex;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  width: 100%;

  &__input {
    &-title {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    
    &-parentId {
      border-left: none;
      border-radius: 0;
      width: 4.5rem;
    }

    &-button {
      border: 1px solid hsl(var(--border));
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
