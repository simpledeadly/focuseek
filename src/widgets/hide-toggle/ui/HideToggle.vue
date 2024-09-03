<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <div>
    <input
      type="checkbox"
      class="hide-toggle"
      v-model="model"
    />
    <label>Hide checked</label>
  </div>
</template>

<style lang="scss"></style>
