<script setup lang="ts">
import { Checkbox } from '@/shared/ui/checkbox'

const model = defineModel<boolean>()
</script>

<template>
  <Checkbox
    v-model="model"
    class="item-checkbox"
  />
</template>

<style lang="scss">
.item-checkbox {
  border-radius: 100%;
}
</style>
