import express from 'express'
import { exit } from 'node:process'
import { CLIENT_URL, PORT } from './utils/constants.js'
import tasksRouter from './routes/tasks.js'
import cors from 'cors'
const app = express()

app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.contentType('text/plain').send('Hello !')
})
app.use(express.json(), cors({
    origin: CLIENT_URL
}))
app.use('/tasks', tasksRouter)

app.listen(PORT, (e) => {
    if (e) {
        console.error(e.message)
        process.exitCode = 1
        exit()
    }
    console.log(`Server's running on port : ${PORT}`)
})