<script setup lang="ts">
defineSlots<{
  logo: () => unknown
  nav: () => unknown
  main: () => unknown
  default?: () => unknown
}>()
</script>

<template>
  <div class="main-layout">
    <slot name="logo" />
    <slot name="nav" />
    <slot name="main" />
    <slot default />
  </div>
</template>

<style lang="scss">
.main-layout {
  /** keep */
}
</style>
