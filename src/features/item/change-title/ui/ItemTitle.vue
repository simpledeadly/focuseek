<script setup lang="ts">
import { ref } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { useItemType } from '@/features/item/filter'

const props = defineProps<{
  title: string
  isDone?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', value: string): void
}>()

const isEdit = ref<boolean>(false)
const newTitle = ref<string>('')
const { itemType } = useItemType()

const toEdit = () => {
  newTitle.value = props.title
  isEdit.value = true
}

const saveChanges = () => {
  emit('save', newTitle.value)
  cancelChanges()
}

const cancelChanges = () => {
  isEdit.value = false
  newTitle.value = ''
}
</script>

<template>
  <div class="item-title">
    <div
      v-if="!isEdit"
      class="item-title__inner"
    >
      <div :class="props.isDone ? 'item-title__label_done' : 'item-title__label'">
        {{ props.title }}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <button
              type="button"
              class="item-title__edit-button"
              @click="toEdit"
            >
              ✎
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit {{ itemType }}'s title</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div
      v-else
      class="item-title__inner-editable"
    >
      <input
        v-model="newTitle"
        type="text"
        class="item-title__input"
      />
      <button
        type="button"
        class="item-title__save-button"
        @click="saveChanges"
      >
        ✓
      </button>
      <button
        type="button"
        class="item-title__cancel-button"
        @click="cancelChanges"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.item-title {
  &__inner {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--radius) - 2px);
    margin-left: 1px;
    text-align: left;
  }

  &__input {
    min-width: 190px;
    max-width: 800px;
    margin-right: calc(var(--radius) - 2px);
    margin-left: calc(var(--radius) - 7px);
    background: hsl(var(--primary-background));
    border: none;
    border-radius: calc(var(--radius) - 2px);
    outline: none;
  }

  &__save-button {
    margin-right: calc(var(--radius) - 2px);
  }

  &__label {
    &_done {
      color: hsl(var(--muted-foreground));
      text-decoration: line-through;
    }
  }

  &__edit-button {
    color: hsl(var(--muted-foreground));
    opacity: 0.5;

    &:hover {
      color: hsl(var(--foreground));
      opacity: 1;
    }
  }
}
</style>
