import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { notes } from './data'

const white = chalk.hex('#fff')

const app = express()
const PORT: string | number = process.env.PORT || 3000

app.use(
	cors({
		origin: 'http://localhost:8080',
	})
)

app.get('/notes', (req, res) => res.send(notes))

app.listen(PORT, () => {
	console.log(white.bold(`Сервер запущен, порт: ${PORT}`))
})
