<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { convertToLink, sanitizeHtml } from '@/shared/lib/utils'
import { useFilters } from '@/features/item/filter'
import { Check, Edit3, X } from 'lucide-vue-next'

const props = defineProps<{
  description?: string | null
}>()

const emit = defineEmits<{
  (e: 'save', value: string | null): void
}>()

const isEdit = ref<boolean>(false)
const newDescription = ref<string | undefined | null>('')
const inputRef = ref<HTMLInputElement | null>(null)
const { itemType } = useFilters()

const displayDescription = computed(() => {
  if (!props.description || props.description.trim() === '') {
    return null
  }
  return sanitizeHtml(convertToLink(props.description))
})

const toEdit = () => {
  newDescription.value = props.description?.replace(/<[^>]+>/g, '') ?? null
  isEdit.value = true

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
      if (newDescription.value) {
        inputRef.value.select()
      }
      setTimeout(() => {
        if (document.activeElement !== inputRef.value) {
          inputRef.value?.focus()
          if (newDescription.value) inputRef.value?.select()
        }
      }, 100)
    } else {
      console.warn('inputRef is null')
    }
  })
}

watch(
  () => props.description,
  (newVal) => {
    if (newVal === '') {
      toEdit()
    }
  },
  { immediate: true }
)

const saveChanges = () => {
  const trimmedValue = newDescription.value?.trim()
  const valueToEmit = trimmedValue || null
  console.log('Saving description:', { newDescription: newDescription.value, valueToEmit })
  emit('save', valueToEmit)
  isEdit.value = false
  newDescription.value = null
}

const cancelChanges = () => {
  console.log(
    'Canceling, original description:',
    props.description,
    'newDescription:',
    newDescription.value
  )
  isEdit.value = false
  if (!props.description || props.description.trim() === '') {
    console.log('Emitting null on cancel')
    emit('save', null)
  }
  newDescription.value = null
}
</script>

<template>
  <div class="item-description">
    <div
      v-if="!isEdit"
      class="item-description__inner"
    >
      <div
        class="item-description__label"
        v-html="displayDescription"
      />
      <Tooltip>
        <TooltipTrigger as-child>
          <button
            type="button"
            class="item-description__edit-button"
            @click="toEdit"
          >
            <Edit3 class="item-title__edit-button_icon" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit {{ itemType }}'s description</p>
        </TooltipContent>
      </Tooltip>
    </div>
    <div
      v-else
      class="item-title__inner-editable"
    >
      <input
        ref="inputRef"
        v-model="newDescription"
        type="text"
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
.item-description {
  font-size: 15px;
  color: hsl(var(--muted-foreground));

  .link {
    color: hsl(var(--muted-foreground));
  }

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

    &:hover {
      color: hsl(var(--foreground));
    }
  }

  &__cancel-button {
    color: hsl(var(--muted-foreground));
    transition: all 0.05s;

    &:hover {
      color: hsl(var(--foreground));
    }
  }

  &__edit-button {
    color: hsl(var(--muted-foreground));
    opacity: 0.5;
    transition: all 0.05s;

    &:hover {
      color: hsl(var(--foreground));
      opacity: 1;
    }
  }
}
</style>
