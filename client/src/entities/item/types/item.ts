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
  durationPlanned?: number
  durationReal?: number
  tags?: string[]
  date?: number
  deadline?: string
  showSubItems?: boolean
}
