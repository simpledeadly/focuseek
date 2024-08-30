<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <div>
    <input
      type="checkbox"
      v-model="model"
      name="hide"
    />
    <label for="hide">Hide checked</label>
  </div>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
