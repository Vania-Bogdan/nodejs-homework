const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const path = require('node:path')

const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/auth/auth')

const auth = require('./middleware/auth')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')))

app.use('/api/contacts', auth, contactsRouter)
app.use('/users', usersRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
