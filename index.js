'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.port || 8080
const mongoose = require('mongoose')
const dbconfig = require('./config/database')

// Pull database configuration and connect to the database
mongoose.connect(dbconfig.database)

// Handle x-www-form-urlencoded requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Log an alert if we're using the fallback database secret
if (dbconfig.secret === 'super-secure-fallback-secret') {
  console.log('INSECURE DATABASE SECRET -- PROCEED WITH CAUTION')
}

// Initialize Express Router
const router = express.Router()
// Define middleware
router.use(function (req, res, next) {
  next()
})
// Pull defined routes
const routes = require('./app/routes')(router)
// Register routes at the app's root prefix
app.use('/', router)

app.listen(port)
console.log('Port', port, 'goes "whirrr..."')
