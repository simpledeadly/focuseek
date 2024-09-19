<script setup lang="ts">
const model = defineModel<boolean>()
</script>

<template>
  <div>
    <input
      v-model="model"
      type="checkbox"
      class="hide-toggle"
    />
    <label>Hide checked</label>
  </div>
</template>

<style lang="scss">
.hide-toggle {
  /** keep */
}
</style>
