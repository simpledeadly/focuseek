<script setup lang="ts">
import { router } from '@/app/router/router'
import { Button } from '@/shared/ui/button'
</script>

<template>
  <div class="not-found">
    <h1 style="font-size: 120px"><strong>404</strong></h1>
    <h2 style="font-size: 30px; color: #777; margin-top: -20px">Кажется вы... заблудились...</h2>
    <br />
    <Button
      variant="default"
      @click="router.push({ name: 'collections' })"
      ><strong>Но выход ЕСТЬ!</strong></Button
    >
  </div>
</template>

<style lang="scss">
.not-found {
  margin-top: 30vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
