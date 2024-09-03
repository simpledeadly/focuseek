<script setup lang="ts">
const model = defineModel<boolean>()
</script>

<template>
  <input
    type="checkbox"
    v-model="model"
    class="item-checkbox"
  />
</template>

<style lang="scss"></style>
