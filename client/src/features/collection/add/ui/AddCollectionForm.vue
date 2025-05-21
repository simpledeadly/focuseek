<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

const emit = defineEmits<{
  (e: 'submit', value: string): void
}>()

const collectionTitle = ref<string>('')

const handleSubmit = () => {
  if (collectionTitle.value.length > 0) {
    emit('submit', collectionTitle.value)
  } else {
    alert('Введите заголовок')
  }
  collectionTitle.value = ''
}
</script>

<template>
  <div class="add-collection-wrapper">
    <div class="flex w-full max-w-sm gap-1.5">
      <form
        name="collectionForm"
        class="add-collection-form"
        @submit.prevent="handleSubmit"
      >
        <Input
          v-model="collectionTitle"
          :placeholder="`Enter collection's title`"
          class="add-collection-form__input"
        />
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              type="button"
              variant="secondary"
              class="add-collection-form__input-button"
              @click="handleSubmit"
            >
              <!-- <CirclePlus class="w-4 h-4" /> -->
              <p>Add</p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new collection</p>
          </TooltipContent>
        </Tooltip>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.add-collection-wrapper {
  margin-bottom: 1.5rem;
}

.add-collection-form {
  display: flex;
  margin: 0 auto;

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
