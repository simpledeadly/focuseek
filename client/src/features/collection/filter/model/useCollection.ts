import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLoading } from '@/app/useLoading'
import { useCollections } from '@/entities/collection'

export const useCollection = () => {
  const route = useRoute()
  const { setLoading } = useLoading()
  const { collections } = useCollections()

  const collection = computed(() => {
    return typeof route.params.collection === 'string'
      ? route.params.collection.toLowerCase()
      : null
  })

  const collectionId = ref<number | null>(null)
  setLoading(true)

  watch(
    [collections, collection],
    () => {
      if (collections.value.length === 0) {
        setLoading(true)
        collectionId.value = null
        return
      }
      setLoading(false)

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

  return { collections, collection, collectionId }
}
