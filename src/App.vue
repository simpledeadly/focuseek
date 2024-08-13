<script setup lang="ts"></script>

<template>
  <nav>
    <RouterLink to="/">Inbox</RouterLink> | <RouterLink to="/materials">Materials</RouterLink> |
    <RouterLink to="/todos">About</RouterLink> |
    <RouterLink to="/projects">Projects</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss">
body {
  background: $bg;
  color: $color;
}
</style>
