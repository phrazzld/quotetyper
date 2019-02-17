// server.js

require('module-alias/register')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const MongoStore = require('connect-mongo')(session)
const app = express()
const port = process.env.port || 8080
const mongoose = require('mongoose')
const config = require('@root/config')
const routes = require('@routes/index')
const auth = require('@root/auth')
const log = config.loggers.dev()

// Pull database configuration and connect to the database
mongoose.connect(config.mongoUrl, { server: { reconnectTries: Number.MAX_VALUE } })
mongoose.connection
  .once('open', () => {
    log.info('Mongoose successfully connected to Mongo')
  })
  .on('error', err => {
    log.info('Mongoose failed to connect to Mongo')
    log.fatal(err)
  })

// Load models
const User = require('@models/user').model
const Quote = require('@models/quote').model
const passportConfig = require('@root/passport')

// Handle x-www-form-urlencoded requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Handle cookies and sessions
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET || 'disgusting foot secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

// Passport authentication
app.use(auth.initialize)
app.use(auth.session)
app.use(auth.setUser)

// Tell Express where to find template files
app.set('views', path.join(__dirname, 'views'))
// Use EJS as our templating engine
app.set('view engine', 'ejs')

// Use API routes
app.use('/', routes)

app.listen(config.port, function (err) {
  if (err) {
    log.info(`Server has a problem listening on port ${config.port}`)
    log.fatal(err)
  } else {
    log.info(`Port ${config.port} goes "whirrr..."`)
  }
})
