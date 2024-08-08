<script setup lang="ts">
const props = defineProps<{
  counter: number
}>()

const emit = defineEmits(['count'])
</script>

<template>
  <button @click="emit('count')" class="button">
    <slot />
    <div class="counter">ㅤ{{ counter }}</div>
  </button>
</template>

<style lang="scss" scoped>
@import url('./styles.scss');
</style>
