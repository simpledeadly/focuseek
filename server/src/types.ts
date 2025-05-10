export type ItemType = 'todo' | 'note'

export type Item = {
  id: number
  userId: number
  collectionId: number
  parentItemId?: number
  title: string
  type: ItemType
  createdAt: number
  editedAt: number
  isDone?: boolean
  description?: string
  priority?: number
  durationPlanned?: BigInt
  durationReal?: BigInt
  tags?: string[]
  date?: number
  deadline?: number
  showSubItems?: boolean
}

export type Collection = {
  id: number
  userId: number
  title: string
  createdAt: number
  editedAt: number
}

export type Timer = {
  id: number
  userId: number
  collectionId: number
  itemId: number
  startTime: number | null
  trackedDuration: number
  isRunning: boolean
}
