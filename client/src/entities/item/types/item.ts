export type ItemType = 'todo' | 'note' | 'project'

export type Item = {
  id: number
  title: string
  type: ItemType
  isDone?: boolean
  subtodos?: Item[]
}

export type SubItem = {
  id: number
  type: Omit<ItemType, 'project'>
  title: string
  isDone?: boolean
}
