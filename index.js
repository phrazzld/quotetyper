'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.port || 8080
const mongoose = require('mongoose')
const config = require('./config')

// Pull database configuration and connect to the database
mongoose.connect(config.mongoUrl, { server: { reconnectTries: Number.MAX_VALUE } })
mongoose.connection
  .once('open', function () {
    console.log('Mongoose successfully connected to Mongo')
  })
  .on('error', function (err) {
    console.error('Mongoose failed to connect to Mongo --', err)
  })

// Handle x-www-form-urlencoded requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Route definitions
app.get('/test', function (req, res) {
  console.log('GET request to /test received')
  res.json({ message: 'API operational' })
})

app.listen(config.port)
console.log('Port', config.port, 'goes "whirrr..."')
