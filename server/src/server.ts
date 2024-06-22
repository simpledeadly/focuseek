import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

const app = express()
const PORT: string | number = process.env.PORT || 3000

app.use(
	cors({
		origin: 'http://localhost:8080',
	})
)

app.get('/', (req, res) => res.send('*это ответ*'))

app.listen(PORT, () => {
	console.log(chalk.hex('#fff').bold(`Сервер запущен, порт: ${PORT}`))
})
