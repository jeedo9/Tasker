import express from 'express'
import { exit } from 'node:process'
import { PORT } from './utils/constants.js'
const app = express()


app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.contentType('text/plain').send('Hello !')
})

app.listen(PORT, (e) => {
    if (e) {
        console.error(e.message)
        process.exitCode = 1
        exit()
    }
    console.log(`Server's running on port : ${PORT}`)
})