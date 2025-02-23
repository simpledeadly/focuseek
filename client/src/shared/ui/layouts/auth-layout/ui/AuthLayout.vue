<script setup lang="ts">
defineSlots<{
  logo: () => unknown
  nav: () => unknown
  main: () => unknown
  footer?: () => unknown
}>()
</script>

<template>
  <div class="auth-layout">
    <slot name="logo" />
    <slot name="nav" />
    <slot name="main" />
    <slot name="footer" />
  </div>
</template>

<style lang="scss">
.auth-layout {
  /** keep */
}
</style>
