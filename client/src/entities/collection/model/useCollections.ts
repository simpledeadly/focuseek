import { defineStore, storeToRefs } from 'pinia'
import { shallowRef } from 'vue'
import type { Collection } from '../types/collection'
import { fetchCollectionsFromServer } from '@/shared/api/api'

const fetchCollections = async (): Promise<Collection[]> => {
  try {
    return await fetchCollectionsFromServer()
  } catch (e) {
    console.error('Ошибка при загрузке данных:', e)
    return []
  }
}

export const useCollectionsStore = defineStore('collections', () => {
  const collections = shallowRef<Collection[]>([])

  const loadCollections = async () => {
    try {
      collections.value = await fetchCollections()
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    }
  }

  if (!collections.value.length) {
    loadCollections()
  }

  return { collections, loadCollections }
})

export const useCollections = () => {
  const { collections } = storeToRefs(useCollectionsStore())

  const findCollectionTitleById = (id: number) => {
    const collection = collections.value.find((col) => col.id === id)
    return collection ? collection.title : 'undefined'
  }

  return { collections, findCollectionTitleById }
}
