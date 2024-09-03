<script setup lang="ts">
import type { ItemType } from '@/entities/item'
import { ASelect } from '@/shared/ui'

const model = defineModel<ItemType>()
</script>

<template>
  <ASelect v-model="model" />
</template>

<style lang="scss"></style>
