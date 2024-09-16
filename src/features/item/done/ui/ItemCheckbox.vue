<script setup lang="ts">
const model = defineModel<boolean>()
</script>

<template>
  <input
    v-model="model"
    type="checkbox"
    class="item-checkbox"
  />
</template>

<style lang="scss">
.item-checkbox {
  cursor: pointer;
}
</style>
