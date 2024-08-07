import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import type { Item } from '../../common/types/types'

let items: Item[] = [
	{ id: 1, description: 'Inbox Item 1', type: 'inbox', isDone: false },
	{ id: 2, description: 'Material Item 1', type: 'material' },
	{ id: 3, description: 'Todo Item 1', type: 'todo', isDone: false },
	{
		id: 4,
		description: 'Project Item 1',
		type: 'project',
		isDone: false,
		subtodos: [],
	},
]

const app = express()
const PORT: string | number = process.env.PORT || 3000

app.use(
	cors({
		origin: 'http://localhost:8080',
	})
)

app.get('/api/items', (req, res) => res.json(items))

app.post('/api/items', (req, res) => {
	const item = req.body
	items.push(item)
	res.status(201).json({ message: 'Элемент успешно добавлен на сервер' })
})

app.delete('/api/items/:id', (req, res) => {
	const id: number = +req.params.id

	const updatedItems: Item[] = items.filter(item => item.id !== id)

	if (updatedItems.length < items.length) {
		res.json({ message: 'Элемент успешно удален с сервера' })
		items = updatedItems
	} else {
		res.status(404).json({ error: 'Элемент с данным ID не найден' })
	}
})

app.listen(PORT, () => {
	console.log(chalk.hex('#000').bold(`Сервер запущен, порт: ${PORT}`))
})
