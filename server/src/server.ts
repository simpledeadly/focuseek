import express from 'express'
import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prismaClient'

type ItemType = 'todo' | 'note' | 'project'

export type Item = {
  id: number
  title: string
  type: ItemType
  isDone?: boolean
  subtodos?: Item[]
}

export type SubItem = {
  id: number
  title: string
  type: ItemType
  isDone?: boolean
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

// === Endpoints ===

// == AUTH ==

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })
    
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = await prisma.user.create({
      data: {
        username,
        password_hash: hashedPassword
      }
    })
    console.log('REGGAAAAA', newUser.id)

    const token = jwt.sign({ id: newUser.id }, 'your_jwt_secret', { expiresIn: '30d' })

    res.status(201).json({ message: 'Пользователь зарегистрирован', token, userId: newUser.id })
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return res.status(401).json({ message: 'Неверные учетные данные' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверные учетные данные' })
    }

    console.log('LOOOGAAAAA', user.id)

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '30d' })

    res.json({ token, userId: user.id })
  } catch (error) {
    console.error('Ошибка при входе:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// == ITEMS ==

// Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'Неавторизованный доступ' })
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret')
    console.log('DECODED:', decoded)

    if (typeof decoded === 'object' && decoded !== null) {
      req.userId = decoded.id
      console.log(req.userId)
      next()
    } else {
      console.error('Проблема с decoded в middleware')
    }
  } catch (error) {
    console.error('Ошибка при проверке токена:', error)
    res.status(401).json({ message: 'Неправильный формат токена' })
  }
}

app.get('/api/items', authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный доступ' })
    }
    
    const decoded = jwt.verify(token, 'your_jwt_secret')
    console.log('GET ITEMS: ', decoded)
    if (typeof decoded === 'object' && decoded !== null) {
      const userId = decoded.id
      const items = await prisma.item.findMany({
        where: { userId: { equals: userId } },
        include: {
          subtodos: true,
        },
      })
      if (!items) {
        return res.status(404).json({ message: 'Элементы не найдены' })
      }
      res.json(items)
    } else {
      console.error('Неправильный формат токена')
      return res.status(401).json({ message: 'Неправильный формат токена' })
    }
  } catch (error) {
    console.error('Ошибка при получении элементов:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})


app.post('/api/items', authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный доступ' })
    }

    const decoded = jwt.verify(token, 'your_jwt_secret')
    if (typeof decoded === 'object' && decoded !== null) {
      const userId = decoded.id
      console.log('decoded ID:', userId)
      const item: Item = req.body
      const newItem = await prisma.item.create({
        data: {
          userId,
          title: item.title,
          type: item.type,
          isDone: item.isDone,
        },
      })
      console.log(chalk.hex('#000').bold(`POST item:`), newItem)
      res.status(201).json({ message: 'Элемент успешно добавлен', item: newItem })
    } else {
      console.error('Неправильный формат токена')
      return res.status(401).json({ message: 'Неправильный формат токена' })
    }
  } catch (error) {
    console.error('Ошибка при добавлении элемента:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.post('/api/items/:id/subitem', async (req, res) => {
  const id = +req.params.id
  const subitem: SubItem = req.body

  try {
    const newSubItem = await prisma.subItem.create({
      data: {
        title: subitem.title,
        type: subitem.type,
        isDone: subitem.isDone,
        parentId: id,
      },
    })
    console.log(chalk.hex('#000').bold(`POST subitem:`), newSubItem)
    res.status(201).json({ message: 'Подэлемент успешно добавлен', subitem: newSubItem })
  } catch (error) {
    console.error('Ошибка при добавлении подэлемента:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.put('/api/items/:id', async (req, res) => {
  const id = +req.params.id
  const updatedItem: Item = req.body

  try {
    const updatedItemData = await prisma.item.update({
      where: { id },
      data: {
        title: updatedItem.title,
        type: updatedItem.type,
        isDone: updatedItem.isDone,
      },
    })
    console.log(chalk.hex('#fff').bold(`PUT item:`), updatedItemData)
    res.status(200).json({ message: 'Элемент успешно обновлен', item: updatedItemData })
  } catch (error) {
    console.error('Ошибка при обновлении элемента:', error)
    res.status(404).json({ message: 'Элемент не найден' })
  }
})

app.delete('/api/items/:id', async (req, res) => {
  const id = +req.params.id

  try {
    await prisma.item.delete({ where: { id } })
    console.log(chalk.hex('#fff').bold(`DELETE item, id:`), id)
    res.status(204).json({ message: 'Элемент успешно удален' })
  } catch (error) {
    console.error('Ошибка при удалении элемента:', error)
    res.status(404).json({ message: 'Элемент не найден' })
  }
})

// app.get('/api/items', (req, res) => {
//   res.json(items)
//   console.log(chalk.hex('#fff').bold(`GET ${items.length} items`))
// })

// app.post('/api/items', (req, res) => {
// 	const item: Item = req.body
// 	items.push(item)
// 	// res.status(201).json({ message: 'Элемент успешно добавлен на сервер', item: item })
//   console.log(chalk.hex('#000').bold(`POST item:`), item)
// })

// app.put('/api/items/:id', (req, res) => {
//   const id = +req.params.id
//   const updatedItem: Item = req.body

//   const index = items.findIndex(item => item.id === id)

//   if (index !== -1) {
//       items[index] = { ...items[index], ...updatedItem }
//       // res.status(200).json({ message: 'Элемент успешно обновлен', item: items[index] })
//       console.log(chalk.hex('#fff').bold(`PUT item:`), items[index])
//   } else {
//       res.status(404).json({ message: 'Элемент не найден' })
//   }
// })

// app.delete('/api/items/:id', (req, res) => {
// 	const id: number = +req.params.id

// 	const updatedItems: Item[] = items.filter(item => item.id !== id)

// 	if (updatedItems.length < items.length) {
// 		// res.status(204).json({ message: 'Элемент успешно удален с сервера', id })
// 		items = updatedItems
//     console.log(chalk.hex('#fff').bold(`DELETE item, id:`), id)
// 	} else {
// 		res.status(404).json({ error: 'Элемент с данным ID не найден' })
// 	}
// })

app.listen(PORT, () => {
	console.log(chalk.hex('#fff').bold(`Сервер запущен, порт: ${PORT}`))
})
