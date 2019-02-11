// routes/general/index.js

const config = require('@root/config')
const helpers = require('@root/helpers')
const log = config.loggers.dev()
const router = require('express').Router()
const Quote = require('@models/quote')

router.get('/', (req, res) => {
  log.info('GET /')
  res.render('home', {
    title: 'QuoteTyper',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.get('/login', (req, res) => {
  log.info(`GET /login`)
  res.render('login', {
    title: 'Login',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.get('/signup', (req, res) => {
  log.info(`GET /signup`)
  res.render('signup', {
    title: 'Signup',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.get('/logout', (req, res) => {
  log.info('GET /logout')
  req.logout()
  res.redirect('/')
})

router.get('/profile', (req, res) => {
  log.info('GET /profile')
  res.render('profile', {
    title: 'Profile',
    email: helpers.getEmail(req),
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.get('/new-quote', (req, res) => {
  log.info('GET /new-quote')
  res.render('new-quote', {
    title: 'New Quote',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.post('/new-quote', (req, res) => {
  log.info('POST /new-quote')
  if (!helpers.isLoggedIn(req)) {
    res.redirect('/login')
  } else {
    const userId = req.user.id
    log.info(`userId: ${userId}`)
    Quote.create({
      text: req.body['new-quote-text'],
      author: req.body['new-quote-author'],
      submittedBy: userId
    })
      .then((result) => {
        log.info(result)
        res.redirect('/quotes')
      })
      .catch((err) => {
        log.fatal(err)
        res.status(500).send(err)
      })
  }
})

router.get('/quotes', (req, res) => {
  log.info('GET /quotes')
  Quote.find()
    .then((quotes) => {
      res.render('quotes', {
        title: 'Quotes',
        quotes: quotes,
        isLoggedIn: helpers.isLoggedIn(req)
      })
    })
    .catch((err) => {
      log.fatal(err)
      res.status(500).send(err)
    })
})

router.get('/test', (req, res) => {
  log.info('GET /test')
  res.render('test', {
    title: 'Typing Test',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

module.exports = router
