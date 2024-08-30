import type { ItemType } from '@/entities/Item'

export const findIdx = (array: ItemType[], id: number) => array.findIndex((item) => item.id === id)
