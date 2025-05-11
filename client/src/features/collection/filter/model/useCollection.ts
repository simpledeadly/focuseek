import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCollections } from '@/entities/collection'

export const useCollection = () => {
  const { collections } = useCollections()
  const route = useRoute()

  const collection = computed(() => {
    return typeof route.params.collection === 'string'
      ? route.params.collection.toLowerCase()
      : null
  })

  const collectionId = ref<number | null>(null)
  const loading = ref(true)

  watch(
    [collections, collection],
    () => {
      if (collections.value.length === 0) {
        loading.value = true
        collectionId.value = null
        return
      }
      loading.value = false

      if (!collection.value) {
        collectionId.value = null
        return
      }

      const found = collections.value.find(
        (col) => col.title.toLocaleLowerCase() === collection.value
      )
      collectionId.value = found ? found.id : null
    },
    { immediate: true }
  )

  return { collections, collection, collectionId, loading }
}
