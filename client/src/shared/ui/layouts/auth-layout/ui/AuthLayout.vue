<script setup lang="ts">
defineSlots<{
  form: () => unknown
}>()
</script>
<template>
  <div class="auth-layout">
    <div class="auth-layout__form">
      <slot name="form" />
    </div>
  </div>
</template>

<style lang="scss">
.auth-layout {
  &__form {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
}
</style>
