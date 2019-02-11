// routes/general/index.js

const config = require('@root/config')
const helpers = require('@root/helpers')
const log = config.loggers.dev()
const router = require('express').Router()
const Quote = require('@models/quote')
const Test = require('@models/test')

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
      let mins = Number(elapsedTime) / 60 / 100
      mins = mins.toFixed(2)
      let wpm = quote.text.length / 5 / mins
      wpm = wpm.toFixed(2)
      let workingQuote = quote.text
      let workingTestInput = typingTestInput
      let extraChars = 0
      for (let i = 0; i < typingTestInput.length; i++) {
        let found = false
        for (let j = 0; j < workingQuote.length; j++) {
          if (typingTestInput[i] === workingQuote[j]) {
            workingQuote = workingQuote.substr(0, j) + workingQuote.substr(j+1, workingQuote.length)
            found = true
            break
          }
        }
        if (!found) {
          extraChars += 1
        }
      }
      let missingChars = workingQuote.length
      let correctChars = quote.text.length - missingChars
      let totalChars = correctChars + extraChars + missingChars
      let accuracy = correctChars / totalChars
      accuracy = accuracy.toFixed(2)
      Test.create({
        wpm: wpm,
        accuracy: accuracy,
        quote: quoteId,
        user: userId
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

module.exports = router
