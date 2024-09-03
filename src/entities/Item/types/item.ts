export type ItemType = 'inbox' | 'material' | 'todo' | 'project'

export type Item = {
  id: number
  title: string
  type: ItemType
  isDone?: boolean
  subtodos?: []
}
