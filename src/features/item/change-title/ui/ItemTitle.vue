<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  isDone?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', value: string): void
}>()

const isEdit = ref<boolean>(false)
const newTitle = ref<string>('')

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
      <button
        type="button"
        class="item-title__edit-button"
        @click="toEdit"
      >
        ✎
      </button>
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
    gap: 6px;
  }

  &__label {
    &_done {
      color: #999;
      text-decoration: line-through;
    }
  }
}
</style>
