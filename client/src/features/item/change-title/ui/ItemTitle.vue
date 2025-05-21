<script setup lang="ts">
import { ref, computed } from 'vue'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { convertToLink, sanitizeHtml } from '@/shared/lib/utils'
import { useFilters } from '@/features/item/filter'
import { Check, Edit3, X } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  isDone?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', value: string): void
}>()

const isEdit = ref<boolean>(false)
const newTitle = ref<string>('')
const { itemType } = useFilters()

const displayTitle = computed(() => sanitizeHtml(convertToLink(props.title)))

const toEdit = () => {
  newTitle.value = props.title.replace(/<[^>]+>/g, '')
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
      <div
        :class="props.isDone ? 'item-title__label_done' : 'item-title__label'"
        v-html="displayTitle"
      />
      <Tooltip v-if="!props.isDone">
        <TooltipTrigger as-child>
          <button
            type="button"
            class="item-title__edit-button"
            @click="toEdit"
          >
            <Edit3 class="item-title__edit-button_icon" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit {{ itemType }}'s title</p>
        </TooltipContent>
      </Tooltip>
    </div>
    <div
      v-else
      class="item-title__inner-editable"
    >
      <input
        v-model="newTitle"
        type="text"
        name="title"
        class="item-title__input"
      />
      <button
        type="button"
        class="item-title__save-button"
        @click="saveChanges"
      >
        <Check class="item-title__save-button_icon" />
      </button>
      <button
        type="button"
        class="item-title__cancel-button"
        @click="cancelChanges"
      >
        <X class="item-title__cancel-button_icon" />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.item-title {
  &__inner {
    display: flex;
    gap: calc(var(--radius) - 2px);
    margin-left: 1px;
    text-align: left;

    &-editable {
      width: 60vw;
      display: flex;
      align-items: center;
    }
  }

  &__input {
    min-width: 190px;
    width: 100%;
    margin-right: calc(var(--radius) - 2px);
    margin-left: calc(var(--radius) - 7px);
    background: hsl(var(--primary-background));
    border-radius: calc(var(--radius) - 2px);
    outline: none;
  }

  &__save-button {
    margin-right: calc(var(--radius) - 2px);
    color: hsl(var(--muted-foreground));
    transition: all 0.05s;

    &_icon {
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: hsl(var(--foreground));
    }
  }

  &__cancel-button {
    color: hsl(var(--muted-foreground));
    transition: all 0.05s;

    &_icon {
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: hsl(var(--foreground));
    }
  }

  &__label {
    &_done {
      color: hsl(var(--muted-foreground));
      text-decoration: line-through;

      .link {
        color: hsl(var(--muted-foreground));
        text-decoration: none;
      }
    }
  }

  &__edit-button {
    color: hsl(var(--muted-foreground));
    opacity: 0.5;
    transition: all 0.05s;

    &_icon {
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: hsl(var(--foreground));
      opacity: 1;
    }
  }
}
</style>
