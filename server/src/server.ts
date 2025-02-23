import express from 'express'
import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Pool } from 'pg'

type ItemType = 'todo' | 'note' | 'project'

export type Item = {
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
app.use(express.json());

const pool = new Pool({
  user: 'simpledeadly', // замените на ваше имя пользователя
  host: 'localhost',
  database: 'focuseek', // замените на имя вашей базы данных
  password: '572005', // замените на ваш пароль
  port: 5432,
});

// === Endpoints ===

// == AUTH ==

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Проверка на существование пользователя
      const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (existingUser.rows.length > 0) {
          return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Вставка данных о пользователе
      const result = await pool.query(
          'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
          [username, hashedPassword]
      );

      // Генерация токена
      const token = jwt.sign({ id: result.rows[0].id }, 'your_jwt_secret', { expiresIn: '30d' });

      // Отправка токена и сообщения об успешной регистрации
      res.status(201).json({ message: 'Пользователь зарегистрирован', token });
  } catch (error) {
      console.error('Ошибка при регистрации:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход пользователя
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

      if (result.rows.length === 0) {
          return res.status(401).json({ message: 'Неверные учетные данные' });
      }

      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Неверные учетные данные' });
      }

      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '30d' });
      res.json({ token });
  } catch (error) {
      console.error('Ошибка при входе:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// == ITEMS ==

app.get('/api/items', (req, res) => {
  res.json(items)
  console.log(chalk.hex('#fff').bold(`GET ${items.length} items`))
})

app.post('/api/items', (req, res) => {
	const item: Item = req.body
	items.push(item)
	// res.status(201).json({ message: 'Элемент успешно добавлен на сервер', item: item })
  console.log(chalk.hex('#000').bold(`POST item:`), item)
})

app.put('/api/items/:id', (req, res) => {
  const id = +req.params.id
  const updatedItem: Item = req.body

  const index = items.findIndex(item => item.id === id)

  if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem }
      // res.status(200).json({ message: 'Элемент успешно обновлен', item: items[index] })
      console.log(chalk.hex('#fff').bold(`PUT item:`), items[index]);
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
    console.log(chalk.hex('#fff').bold(`DELETE item, id:`), id)
	} else {
		res.status(404).json({ error: 'Элемент с данным ID не найден' })
	}
})

app.listen(PORT, () => {
	console.log(chalk.hex('#fff').bold(`Сервер запущен, порт: ${PORT}`))
})
