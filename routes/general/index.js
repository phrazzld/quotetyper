// routes/general/index.js

const config = require('@root/config')
const log = config.loggers.dev()
const router = require('express').Router()

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html')
})

router.get('/login', (req, res) => {
  log.info(`GET /login`)
  log.info(req.user)
  log.info(req.session)
  res.sendFile(__dirname + '/login.html')
})

router.get('/signup', (req, res) => {
  log.info(`GET /signup`)
  log.info(req.user)
  log.info(req.session)
  res.sendFile(__dirname + '/signup.html')
})

router.get('/logout', (req, res) => {
  log.info('GET /logout')
  log.info(req.user)
  log.info(req.session)
  req.logout()
  res.redirect('/')
})

module.exports = router
