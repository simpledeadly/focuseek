<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from 'vue'

type ObjType = { counter: number; someString: string }

const obj: ObjType = {
  counter: 0,
  someString: 'one msg'
}

const btn = ref(null)
// onMounted(() => console.log(btn.value))

const counter = ref<number>(0)

const array = reactive<[string, boolean]>(['first', true])
const counterInObject = reactive<ObjType>(obj)

watch(counter, (counter, prevCounter) => console.log('prev:', prevCounter, 'actual:', counter))

watchEffect(() => console.log(counter.value))

let sum = ref<number>(0)

sum = computed<number>({
  get: () => counter.value + counterInObject.counter,
  set: (val) => (counter.value = val + 10)
})
// sum.value = 200
</script>

<template>
  <p>result computed: {{ sum }}</p>
  <button @click="counter++" ref="btn">Increment1 {{ counter }}</button>
  <button @click="counterInObject.counter++">Increment2 {{ counterInObject.counter }}</button>
  <br />
  <input type="checkbox" v-model="array[1]" />
  <input type="text" v-model="counterInObject.someString" />
</template>

<style lang="scss">
body {
  background: $bg;
  color: $color;
}
</style>
