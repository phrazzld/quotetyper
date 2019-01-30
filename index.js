'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.port || 8080
const mongoose = require('mongoose')
const config = require('./config')
const apiRoutes = require('./api-routes')

// Pull database configuration and connect to the database
mongoose.connect(config.mongoUrl, { server: { reconnectTries: Number.MAX_VALUE } })
mongoose.connection
  .once('open', () => {
    console.log('Mongoose successfully connected to Mongo')
  })
  .on('error', (err) => {
    console.error('Mongoose failed to connect to Mongo --', err)
  })

// Load models
const User = require('./models/user')
const passportConfig = require('./passport')

// Handle x-www-form-urlencoded requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Use API routes
app.use('/api', apiRoutes)

app.listen(config.port)
console.log('Port', config.port, 'goes "whirrr..."')
