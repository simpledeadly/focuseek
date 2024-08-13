export type ChooseType2 = InboxType | MaterialType | TodoType | ProjectType

export type InboxType = {
  id: number
  title: string
  type: 'inbox'
  isDone: boolean
  isEditting: boolean
}

export type MaterialType = {
  id: number
  title: string
  type: 'material'
  isEditting: boolean
}

export type TodoType = {
  id: number
  title: string
  type: 'todo'
  isDone: boolean
  isEditting: boolean
}

export type ProjectType = {
  id: number
  title: string
  type: 'project'
  isDone: boolean
  subtodos: []
  isEditting: boolean
}
