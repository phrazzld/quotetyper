// routes/general/index.js

const config = require('@root/config')
const helpers = require('@root/helpers')
const log = config.loggers.dev()
const router = require('express').Router()
const Quote = require('@models/quote').model
const Test = require('@models/test').model
const User = require('@models/user').model
const passport = require('passport')

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
  log.info('req.user')
  log.info(req.user)
  log.info(req.user._id)
  Test.find({ "user._id": req.user._id })
    .then((tests) => {
      res.render('profile', {
        title: 'Profile',
        email: helpers.getEmail(req),
        isLoggedIn: helpers.isLoggedIn(req),
        tests: tests
      })
    })
    .catch((err) => {
      log.fatal(err)
      res.status(500).send(err)
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
  Quote.count().exec((err, count) => {
    let random = Math.floor(Math.random() * count)
    Quote.findOne().skip(random).exec((err, quote) => {
      if (err) {
        log.fatal(err)
        res.status(500).send(err)
      } else {
        res.render('test', {
          title: 'Typing Test',
          isLoggedIn: helpers.isLoggedIn(req),
          quote: quote
        })
      }
    })
  })
})

router.post('/test', (req, res) => {
  log.info('POST /test')
  const { body: {
    typingTestInput,
    elapsedTime,
    quoteId
  }, user: { id: userId }} = req
  // Fetch quote, calculate wpm and accuracy
  Quote.findOne({ _id: quoteId })
    .then((quote) => {
      let wpm = helpers.calculateWPM(elapsedTime, quote.text)
      let accuracy = helpers.calculateAccuracy(elapsedTime, quote.text, typingTestInput)
      User.findOne({ _id: userId })
        .then((user) => {
          Test.create({
            wpm: wpm,
            accuracy: accuracy,
            quote: quote,
            user: user
          })
            .then((test) => {
              log.info('Successfully created Test')
              let testUrl = `/test/${test.id}`
              res.redirect(testUrl)
            })
            .catch((err) => {
              log.fatal(err)
              res.status(500).send(err)
            })
        })
        .catch((err) => {
          log.fatal(err)
          res.status(500).send(err)
        })
    })
    .catch((err) => {
      log.fatal(err)
      res.status(500).send(err)
    })
})

router.get('/test/:testId', (req, res) => {
  log.info(`GET /test/${req.params.testId}`)
  Test.findOne({ _id: req.params.testId })
    .then((test) => {
      let displayAccuracy = `${test.accuracy * 100} %`
      res.render('test-results', {
        title: 'Test Results',
        quote: test.quote,
        user: test.user,
        wpm: test.wpm,
        accuracy: displayAccuracy,
        isLoggedIn: helpers.isLoggedIn(req)
      })
    })
    .catch((err) => {
      log.fatal(err)
      res.status(500).send(err)
    })
})

router.get('/reset-quotes', (req, res) => {
  Quote.remove()
    .then((result) => {
      helpers.generateQuotes()
      res.redirect('/quotes')
    })
    .catch((err) => {
      log.fatal(err)
      res.status(500).send(err)
    })
})

router.get('/reset-database', (req, res) => {
  helpers.resetDatabase()
  res.redirect('/')
})

module.exports = router
