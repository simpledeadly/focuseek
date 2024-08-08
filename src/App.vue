<script setup lang="ts"></script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink> | <RouterLink to="/about">About</RouterLink> |
    <RouterLink to="/todo">Todo</RouterLink>
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
