<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', value: string): void
}>()

const slots = defineSlots<{
  select?: () => unknown
}>()

const itemTitle = ref<string>('')

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
  <form
    class="add-item-form"
    @submit.prevent="handleSubmit"
  >
    <input
      v-model="itemTitle"
      type="text"
      class="add-item-form__input"
    />
    <slot
      v-if="slots.select"
      name="select"
    />
  </form>
</template>

<style lang="scss">
.add-item-form {
  &__input {
    margin-bottom: 0.5rem;
    outline: none;
  }
}
</style>
