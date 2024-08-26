<script setup lang="ts">
import { ASelect } from '@/components'
import { type ChooseType } from '@/store'
import { ref } from 'vue'

const props = defineProps<{
  title: string
  type: ChooseType
}>()

const emit = defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'remove'): void
}>()

const type = defineModel<ChooseType>('type')
const isDone = defineModel<boolean>('isDone')
const newTitle = ref<string>('')
const isEditting = ref<boolean>(false)

const handleEdit = () => {
  newTitle.value = props.title
  isEditting.value = true
}

const handleSave = () => {
  emit('update:title', newTitle.value)
  handleFinished()
}

const handleFinished = () => {
  newTitle.value = ''
  isEditting.value = false
}

const handleRemove = () => {
  emit('remove')
}
</script>

<template>
  <li class="list-item">
    <div
      v-if="!isEditting"
      class="container"
    >
      <div v-if="props.type !== 'material'">
        <input
          type="checkbox"
          v-model="isDone"
          name="isDone"
        />
      </div>
      <div :class="props.type !== 'material' && isDone && 'done-task'">{{ props.title }}</div>
      <div
        class="action"
        @click="handleEdit"
      >
        ㅤ✎
      </div>
      <div
        class="action"
        @click="handleRemove"
      >
        ㅤ&times;ㅤ
      </div>
      <ASelect v-model="type" />
    </div>
    <div
      v-else
      class="container"
    >
      <input
        class="input-editting"
        type="text"
        name="edit-title"
        v-model="newTitle"
      />
      <button
        class="button-action"
        @click="handleSave"
      >
        ✓
      </button>
      <button
        class="button-action"
        @click="handleFinished"
      >
        &times;
      </button>
    </div>
  </li>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
