export type Item = {
	id: number
	description: string
	type: 'inbox' | 'material' | 'todo' | 'project'
	isDone?: boolean
	subtodos?: Item[]
}

export type State = {
	items: Item[]
}
