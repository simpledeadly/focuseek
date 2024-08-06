// watch(counter, () => console.log('watch() counter:', counter.value), { immediate: true })
// watchEffect(() => console.log('watch() counter:', counter.value))
// watch(counterInObject, () => console.log('watch() counterInObject:', counterInObject))
// watch(
//   () => counterInObject.counter,
//   () => console.log('watch() counterInObject.counter:', counterInObject.counter)
// )

// watch(
//   () => counterInObject.counter,
//   (after, before) => console.log(before, after)
// )
// watch(
//   () => array[1],
//   (after, before) => console.log(before, after)
// )

// watchEffect(
//   () => {
//     console.log(counter.value)
//   },
//   { flush: 'post' }
// )
// // they equivalent
// watchPostEffect(() => {
//   console.log(counter.value)
// })

// const stop = watchEffect(() => {})
// stop()

// sum = computed<number>(() => counter.value + counterInObject.counter)
