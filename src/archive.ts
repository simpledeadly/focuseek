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

// ===========

// type ObjType = { counter: number; someString: string; location: { city: string } }

// const obj: ObjType = {
//   counter: 0,
//   someString: 'one msg',
//   location: {
//     city: 'Novosibirsk'
//   }
// }

// const btn = ref(null)
// onMounted(() => console.log(btn.value))

// const counter = ref<number>(0)

// const array = reactive<[string, boolean]>(['first', true])
// const counterInObject = reactive<ObjType>(obj)
// const counterInObject2 = shallowReactive<ObjType>(obj)

// const shallowObject = shallowReactive<ObjType>(obj)

// watch(shallowObject, () => console.log('Изменение обнаружено!')) // Отслеживает только верхний уровень

// const shalla = shallowRef<any>({ greet: 'JS!', nest: { someString: 'string' } })

// watchEffect(() => {
//   console.log(shalla.value.nest.someString)
// })

// watchEffect(() => {
//   console.log('from here:', shallowObject.location.city)
// })

// watch(shalla, (now, prev) => {
//   console.log('was:', prev.greet, '| now:', now.greet)
// })

// watch(counter, (counter, prevCounter) => console.log('prev:', prevCounter, 'actual:', counter))

// watchEffect(() => console.log(counter.value))

// let sum = ref<number>(0)

// sum = computed<number>({
//   get: () => counter.value + counterInObject.counter,
//   set: (val) => (counter.value = val + 10)
// })
// sum.value = 200

// function handleClick() {
//   shalla.value.nest.someString = 'number! :D'
//   triggerRef(shalla)
// }

// function handleClick2() {
//   // triggerRef(shallowObject)
// }

// console.log(isRef(counter))
// console.log(isRef(shalla))
// console.log(isReactive(shallowObject))
// console.log(isReactive(counterInObject2))
// console.log(toRaw(isProxy(counterInObject2)))
// console.log(isProxy(shalla))

// onMounted(() => {
//   console.log('mounted!', isRef(counter))
// })

// onUpdated(() => {
//   console.log('updated!', isRef(counter))
// })

// <!-- <p>result computed: {{ sum }}</p> -->
//   <button @click="counter++" ref="btn">Increment1 {{ counter }}</button>
//   <button @click="counterInObject.counter++">Increment2 {{ counterInObject.counter }}</button>
//   <br />
//   <input type="checkbox" v-model="array[1]" />
//   <input type="text" v-model="counterInObject.someString" />
//   <br />
//   <input type="text" v-model="shallowObject.someString" />
//   <input type="text" v-model="shallowObject.location.city" @change="console.log(shallowObject)" />
//   <br />
//   <input type="text" v-model="shalla.greet" @change="console.log(shalla.greet)" />
//   <div @click="handleClick">click to trigger ref</div>
//   <div @click="handleClick2">click to trigger reactive</div>
