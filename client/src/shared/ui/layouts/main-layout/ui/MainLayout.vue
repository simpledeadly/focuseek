<script setup lang="ts">
defineSlots<{
  content: () => unknown
}>()
</script>
<template>
  <div class="main-layout">
    <div class="main-layout__content">
      <slot name="content" />
    </div>
  </div>
</template>

<style lang="scss">
.main-layout {
  width: 100%;
  
  &__content {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
}
</style>
