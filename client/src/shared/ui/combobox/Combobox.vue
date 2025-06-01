<script setup lang="ts">
import { ComboboxRoot, type ComboboxRootEmits, type ComboboxRootProps, useForwardPropsEmits } from 'reka-ui'

const props = defineProps<ComboboxRootProps>()
const emits = defineEmits<ComboboxRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ComboboxRoot v-bind="forwarded" class="[&_*]:!outline-none [&_*]:!shadow-none [&_*]:!ring-0">
    <slot />
  </ComboboxRoot>
</template>
