import type { ItemType } from '@/entities/Item/model/ItemModel'

export const db: ItemType[] = [
  {
    id: Date.now(),
    title: 'First todo to do :)',
    type: 'todo',
    isDone: false
  },
  {
    id: Date.now() + 1,
    title: 'Second todo to do ;D',
    type: 'todo',
    isDone: false
  },
  {
    id: Date.now() + 2,
    title: 'Third todo already done :3',
    type: 'todo',
    isDone: true
  }
]
