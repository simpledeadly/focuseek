<script setup lang="ts">
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
    &times;
  </button>
</template>

<style lang="scss">
.item-remove-button {
  /** keep */
}
</style>
