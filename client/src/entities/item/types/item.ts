export type ItemType = 'todo' | 'note' | 'project'

export type Item = {
  id: number
  userId: number
  title: string
  type: ItemType
  isDone?: boolean
  subtodos?: SubItem[]
}

export type SubItem = {
  id: number
  type: Omit<ItemType, 'project'>
  title: string
  isDone?: boolean
}
