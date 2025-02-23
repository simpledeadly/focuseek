import express from 'express'
import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'

type ItemType = 'todo' | 'note' | 'project'

type Item = {
  id: number
  title: string
  type: ItemType
  isDone?: boolean
  subtodos?: Item[]
}

let items: Item[] = [
  {
    id: Date.now(),
    title: 'Добавить настройки',
    type: 'todo',
    isDone: true,
  },
  {
    id: Date.now() + 1,
    title: 'Валидировать ошибки по приложению',
    type: 'todo',
    isDone: false,
  },
  {
    id: Date.now() + 2,
    title: 'Добавить хоткеи',
    type: 'todo',
    isDone: false,
  },
  {
    id: Date.now() + 3,
    title: 'Очень крутой проект',
    type: 'project',
    isDone: false,
    subtodos: [
      {
        id: Date.now() + 4,
        title: 'first subitem, this is todo',
        isDone: false,
        type: 'todo',
      },
      {
        id: Date.now() + 5,
        title: 'second subitem, todo too',
        isDone: true,
        type: 'todo',
      },
      {
        id: Date.now() + 6,
        title: 'third subitem but this is note',
        type: 'note',
      },
    ],
  },
  {
    id: Date.now() + 7,
    title: 'Затемнить цвет чекбоксов',
    type: 'note',
  },
  {
    id: Date.now() + 8,
    title: 'Подобрать цвета для типов, сделать рамку',
    type: 'note',
  },
  {
    id: Date.now() + 9,
    title: 'Сделать карандаш видимым',
    type: 'note',
  },
]

const app = express()
const PORT: string | number = process.env.PORT || 3000

app.use(
	cors({
		origin: 'http://localhost:5173',
	})
)
app.use(express.json())

// Endpoints

app.get('/api/items', (req, res) => {
  res.json(items)
  console.log(chalk.hex('#000').bold(`GET ${items.length} items`))
})

app.post('/api/items', (req, res) => {
	const item: Item = req.body
	items.push(item)
	// res.status(201).json({ message: 'Элемент успешно добавлен на сервер', item: item })
  console.log(chalk.hex('#000').bold(`POST item:`), item)
})

app.put('/api/items/:id', (req, res) => {
  const id = +req.params.id
  const updatedItem = req.body

  const index = items.findIndex(item => item.id === id)

  if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem }
      // res.status(200).json({ message: 'Элемент успешно обновлен', item: items[index] })
      console.log(chalk.hex('#000').bold(`PUT item:`), items[index]);
  } else {
      res.status(404).json({ message: 'Элемент не найден' })
  }
})

app.delete('/api/items/:id', (req, res) => {
	const id: number = +req.params.id

	const updatedItems: Item[] = items.filter(item => item.id !== id)

	if (updatedItems.length < items.length) {
		// res.status(204).json({ message: 'Элемент успешно удален с сервера', id })
		items = updatedItems
    console.log(chalk.hex('#000').bold(`DELETE item, id:`), id)
	} else {
		res.status(404).json({ error: 'Элемент с данным ID не найден' })
	}
})

app.listen(PORT, () => {
	console.log(chalk.hex('#fff').bold(`Сервер запущен, порт: ${PORT}`))
})
