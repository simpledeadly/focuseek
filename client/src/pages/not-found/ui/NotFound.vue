<script setup lang="ts">
import { router } from '@/app/router'
import { Button } from '@/shared/ui/button'

</script>

<template>
  <div class="not-found">
    <h1 style="font-size: 120px;"><strong>404</strong></h1>
    <h2 style="font-size: 30px; color: #aaa">Кажется вы... заблудились...</h2>
    <br>
    <br>
    <Button @click="router.push({ path: '/' })"><strong>Но выход ЕСТЬ!</strong></Button>
  </div>
</template>

<style lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
