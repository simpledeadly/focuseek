<template>
  <nav class="app-navbar">
    <RouterLink to="/">
      <button
        type="button"
        class="navbar__link"
      >
        Todos
      </button>
    </RouterLink>
    <RouterLink to="/?type=material">
      <button
        type="button"
        class="navbar__link"
      >
        Materials
      </button>
    </RouterLink>
    <RouterLink to="/?type=project">
      <button
        type="button"
        class="navbar__link"
      >
        Projects
      </button>
    </RouterLink>
  </nav>
</template>

<style lang="scss">
.app-navbar {
  display: flex;
  gap: 4px;
  margin-bottom: 1.5rem;
}
</style>
