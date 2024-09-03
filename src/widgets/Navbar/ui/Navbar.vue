<script setup lang="ts"></script>

<template>
  <nav class="navbar">
    <button
      type="button"
      class="navbar__link"
    >
      <RouterLink to="/">Inbox</RouterLink>
    </button>
    <button
      type="button"
      class="navbar__link"
    >
      <RouterLink to="/?type=material">Materials</RouterLink>
    </button>
    <button
      type="button"
      class="navbar__link"
    >
      <RouterLink to="/?type=todo">Todos</RouterLink>
    </button>
    <button
      type="button"
      class="navbar__link"
    >
      <RouterLink to="/?type=project">Projects</RouterLink>
    </button>
  </nav>
</template>

<style lang="scss">
.navbar {
  margin-bottom: 1.5rem;
}
</style>
