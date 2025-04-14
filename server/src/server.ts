import express from 'express'
import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prismaClient'
import { authenticate } from './middlewares/authentication'

type ItemType = 'todo' | 'note'

type Item = {
  id: number
  userId: number
  collectionId: number
  parentItemId?: number
  title: string
  type: ItemType
  createdAt: number
  editedAt: number
  isDone?: boolean
  description?: string
  priority?: number
  durationPlanned?: number
  durationReal?: number
  tags?: string[]
  date?: number
  deadline?: number
  showSubItems?: boolean
}

type Collection = {
  id: number
  userId: number
  title: string
  createdAt: number
  editedAt: number
}

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
        password_hash: hashedPassword,
      },
    })
    console.log('REGGAAAAA', newUser.id)

    await prisma.collection.createMany({
      data: [
        {
          userId: newUser.id,
          title: 'Inbox',
          createdAt: new Date(),
          editedAt: new Date(),
        },
        {
          userId: newUser.id,
          title: 'Today',
          createdAt: new Date(),
          editedAt: new Date(),
        },
      ],
    })

    const token = jwt.sign({ id: newUser.id }, 'your_jwt_secret', {
      expiresIn: '30d',
    })

    res.status(201).json({
      message: 'Пользователь зарегистрирован',
      token,
      userId: newUser.id,
    })
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

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', {
      expiresIn: '30d',
    })

    res.json({ token, userId: user.id })
  } catch (error) {
    console.error('Ошибка при входе:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// == COLLECTIONS ==

app.get('/api/collections', authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный доступ' })
    }

    const decoded = jwt.verify(token, 'your_jwt_secret')
    console.log('GET COLLECTIONS: ', decoded)
    if (typeof decoded === 'object' && decoded !== null) {
      const userId = decoded.id
      const collections = await prisma.collection.findMany({
        where: { userId: { equals: userId } },
      })
      if (!collections) {
        return res.status(404).json({ message: 'Коллекции не найдены' })
      }
      res.json(collections)
    } else {
      console.error('Неправильный формат токена')
      return res.status(401).json({ message: 'Неправильный формат токена' })
    }
  } catch (error) {
    console.error('Ошибка при получении коллекций:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.post('/api/collections', authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: 'Неавторизованный доступ' })
    }

    const decoded = jwt.verify(token, 'your_jwt_secret')
    if (typeof decoded === 'object' && decoded !== null) {
      const userId = decoded.id
      console.log('decoded ID:', userId)
      const collection: Collection = req.body
      const newCollection = await prisma.collection.create({
        data: {
          userId,
          title: collection.title,
          createdAt: new Date(collection.createdAt),
          editedAt: new Date(collection.editedAt),
        },
      })
      console.log(chalk.hex('#000').bold(`POST collection:`), newCollection)
      res.status(201).json({
        message: 'Коллекция успешно добавлена',
        collection: newCollection,
      })
    } else {
      console.error('Неправильный формат токена')
      return res.status(401).json({ message: 'Неправильный формат токена' })
    }
  } catch (error) {
    console.error('Ошибка при добавлении коллекции:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.put('/api/collections/:id', async (req, res) => {
  const id = +req.params.id
  const updatedCollection: Collection = req.body

  try {
    const updatedCollectionData = await prisma.collection.update({
      where: { id },
      data: {
        title: updatedCollection.title,
        createdAt: new Date(updatedCollection.createdAt),
        editedAt: new Date(updatedCollection.editedAt),
      },
    })
    console.log(chalk.hex('#fff').bold(`PUT collection:`), updatedCollectionData)
    res.status(200).json({
      message: 'Коллекция успешно обновлена',
      collection: updatedCollectionData,
    })
  } catch (error) {
    console.error('Ошибка при обновлении коллекции:', error)
    res.status(404).json({ message: 'Коллекция не найдена' })
  }
})

app.delete('/api/collections/:id', async (req, res) => {
  const id = +req.params.id

  try {
    await prisma.collection.delete({ where: { id } })
    console.log(chalk.hex('#fff').bold(`DELETE collection, id:`), id)
    res.status(204).json({ message: 'Коллекция успешно удалена' })
  } catch (error) {
    console.error('Ошибка при удалении коллекции:', error)
    res.status(404).json({ message: 'Коллекция не найдена' })
  }
})

// == ITEMS ==

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

      if (!item.title) {
        return res.status(400).json({ message: 'Поле "title" обязательно' })
      } else {
        console.log('Request body:', req.body, item)
      }

      const newItem = await prisma.item.create({
        data: {
          userId,
          collectionId: Number(item.collectionId),
          parentItemId: item.parentItemId,
          title: item.title,
          type: item.type,
          createdAt: new Date(item.createdAt),
          editedAt: new Date(item.editedAt),
          isDone: item.isDone,
          description: item.description,
          priority: item.priority,
          durationPlanned: item.durationPlanned,
          durationReal: item.durationReal,
          tags: item.tags,
          date: item.date ? new Date(item.date) : undefined,
          deadline: item.deadline ? new Date(item.deadline) : undefined,
          showSubItems: item.showSubItems,
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

app.put('/api/items/:id', async (req, res) => {
  const id = +req.params.id
  const updatedItem: Item = req.body

  try {
    const updatedItemData = await prisma.item.update({
      where: { id },
      data: {
        collectionId: Number(updatedItem.collectionId),
        parentItemId: updatedItem.parentItemId,
        title: updatedItem.title,
        type: updatedItem.type,
        createdAt: new Date(updatedItem.createdAt),
        editedAt: new Date(updatedItem.editedAt),
        isDone: updatedItem.isDone,
        description: updatedItem.description,
        priority: updatedItem.priority,
        durationPlanned: updatedItem.durationPlanned,
        durationReal: updatedItem.durationReal,
        tags: updatedItem.tags,
        date: updatedItem.date ? new Date(updatedItem.date) : null,
        deadline: updatedItem.deadline ? new Date(updatedItem.deadline) : null,
        showSubItems: updatedItem.showSubItems,
      },
    })
    console.log(chalk.hex('#fff').bold(`PUT item:`), updatedItemData)
    res.status(200).json({ message: 'Элемент успешно обновлен', item: updatedItemData })
  } catch (error) {
    console.error('Ошибка при обновлении элемента:', error)
    res.status(404).json({ message: 'Элемент не найден' })
  }
})

const deleteItemWithSubItems = async (id: number): Promise<void> => {
  const subItems = await prisma.item.findMany({
    where: { parentItemId: id },
  })

  for (const subItem of subItems) {
    await deleteItemWithSubItems(subItem.id)
  }

  await prisma.item.delete({ where: { id } })
}

app.delete('/api/items/:id', async (req, res) => {
  const id = +req.params.id

  try {
    await deleteItemWithSubItems(id)
    console.log(chalk.hex('#fff').bold(`DELETE item, id:`), id)
    res.status(204).json({ message: 'Элемент успешно удален' })
  } catch (error) {
    console.error('Ошибка при удалении элемента:', error)
    res.status(404).json({ message: 'Элемент не найден' })
  }
})

app.listen(PORT, () => {
  console.log(chalk.hex('#fff').bold(`Сервер запущен, порт: ${PORT}`))
})
