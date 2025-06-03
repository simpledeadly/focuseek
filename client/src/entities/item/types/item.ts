export type ItemType = 'todo' | 'note'

export type Item = {
  id: number
  userId: number
  collectionId: number
  parentItemId?: number | null
  title: string
  type: ItemType
  createdAt: number
  editedAt: number
  doneAt: number | null
  isDone?: boolean
  description?: string | null
  priority?: number | null
  durationPlanned?: number | null
  durationReal?: number | null
  tags?: string[]
  date?: number
  deadline?: number
  showSubItems?: boolean
  order: number
}
