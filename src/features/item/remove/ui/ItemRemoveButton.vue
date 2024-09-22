<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <button
    type="button"
    class="item-remove-button"
    @click="emit('remove')"
  >
    <Trash2 :size="16" />
    <!-- &times; -->
    <!-- delete -->
  </button>
</template>

<style lang="scss">
.item-remove-button {
  display: flex;
}
</style>
