const config = require('./utils/config')

const express = require('express')
const app = express()
require('express-async-errors')

const cors = require('cors')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const mongoose = require('mongoose')
const mongoUrl = config.MONGODB_URI

logger.info(`Connecting to MongoDB at ${mongoUrl}`)

mongoose.connect(mongoUrl)
    .then( () => { logger.info('Connected to MongoDB') } )
    .catch( error => { logger.info('Error connecting to MongoDB: ', error.message) } )

app.use(cors())
app.use(express.json())

app.use( middleware.requestLogger )
app.use( middleware.tokenExtractor )

app.use( '/api/blogs', blogsRouter )
app.use( '/api/users', usersRouter )
app.use( '/api/login', loginRouter )

app.use( middleware.unknownEndpoint )
app.use( middleware.errorHandler )

module.exports = app