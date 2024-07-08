import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { Item } from '../../common/types/interfaces'

let items: Item[] = [
	{
		id: 1,
		title: 'one',
		category: 'task',
	},
	{
		id: 2,
		title: 'two',
		category: 'task',
	},
	{
		id: 3,
		title: 'three',
		category: 'project',
	},
	{
		id: 4,
		title: 'four',
		category: 'material',
	},
	{
		id: 5,
		title: 'five',
		category: 'inbox',
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
	console.log(chalk.hex('#fff').bold(`Сервер запущен, порт: ${PORT}`))
})
