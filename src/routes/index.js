// src/routes/index.js

const router = require('express').Router()
const log = require('@root/config').loggers.dev()
const passport = require('passport')
const helpers = require('@root/helpers')
const User = require('@models/user').model
const Quote = require('@models/quote').model
const TestResult = require('@models/test-result').model

router.get('/', (req, res) => {
  log.info('GET /')
  res.render('home', {
    title: 'QuoteTyper',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.get('/login', (req, res) => {
  log.info('GET /login')
  res.render('login', {
    title: 'Login',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), (req, res) => {
  log.info('POST to /login')
  return res.redirect('/profile')
})

router.get('/signup', (req, res) => {
  log.info('GET /signup')
  res.render('signup', {
    title: 'Signup',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.post('/signup', async (req, res) => {
  log.info('POST /signup')
  const { body: {
    email,
    password,
    'password-confirmation': passwordConfirmation
  } } = req
  if (!email || !password) {
    return res.status(422).send({ message: 'Invalid email or password' })
  }
  if (password !== passwordConfirmation) {
    return res.status(422).send({ message: 'Password confirmation does not match' })
  }
  try {
    const user = new User({ email: email })
    await user.setPassword(password)
    await user.save()
    passport.authenticate('local')(req, res, function () {
      res.redirect('/profile')
    })
  } catch (err) {
    log.fatal(err)
    res.status(500).send(err)
  }
})

router.get('/logout', helpers.forceAuth, (req, res) => {
  log.info('GET /logout')
  req.logout()
  res.redirect('/')
})

router.get('/profile', helpers.forceAuth, async (req, res) => {
  log.info('GET /profile')
  const testResults = await TestResult.find({ userId: helpers.getUserId(req) })
  res.render('profile', {
    title: 'Profile',
    email: helpers.getUserEmail(req),
    testResults: testResults,
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.get('/profile/edit', helpers.forceAuth, (req, res) => {
  res.render('edit-profile', {
    title: 'Edit Profile',
    email: helpers.getUserEmail(req),
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.post('/profile/edit', helpers.forceAuth, async (req, res) => {
  const { body: {
    email,
    password,
    'password-confirmation': passwordConfirmation
  } } = req
  try {
    const user = await User.findOne({ _id: helpers.getUserId(req) })
    if (email) {
      user.email = email
    }
    if (password === passwordConfirmation) {
      await user.setPassword(password)
    }
    await user.save()
    res.redirect('/profile')
  } catch (err) {
    log.fatal(err)
    res.status(500).send(err)
  }
})

router.post('/profile/delete', helpers.forceAuth, async (req, res) => {
  try {
    await User.deleteOne({ _id: helpers.getUserId(req) })
    res.redirect('/')
  } catch (err) {
    log.fatal(err)
    res.status(500).send(err)
  }
})

router.get('/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find({})
    res.render('quotes', {
      title: 'Quotes',
      isLoggedIn: helpers.isLoggedIn(req),
      quotes: quotes
    })
  } catch (err) {
    log.fatal(err)
    res.status(500).send(err)
  }
})

router.get('/quotes/new', helpers.forceAuth, (req, res) => {
  res.render('new-quote', {
    title: 'New Quote',
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

router.post('/quotes/new', helpers.forceAuth, async (req, res) => {
  const { body: {
    'new-quote-text': quoteText,
    'new-quote-author': quoteAuthor
  } } = req
  try {
    await Quote.create({
      text: quoteText,
      author: quoteAuthor,
      submittedBy: helpers.getUserId(req)
    })
    res.redirect('/quotes')
  } catch (err) {
    log.fatal(err)
    res.status(500).send(err)
  }
})

router.get('/typing-test', async (req, res) => {
  try {
    const quoteCount = await Quote.count()
    const random = Math.floor(Math.random() * quoteCount)
    const quote = await Quote.findOne({}).skip(random)
    res.render('typing-test', {
      title: 'Typing Test',
      quote: quote,
      isLoggedIn: helpers.isLoggedIn(req)
    })
  } catch (err) {
    log.fatal(err)
    res.status(500).send(err)
  }
})

router.post('/typing-test', helpers.forceAuth, async (req, res) => {
  const { body: { submission, elapsedTime, quoteId } } = req
  log.info(`submission: ${submission}\nelapsedTime: ${elapsedTime}\nquoteId: ${quoteId}`)
  try {
    const quote = await Quote.findOne({ _id: quoteId })
    const wpm = helpers.calculateWPM(elapsedTime, submission)
    const accuracy = helpers.calculateAccuracy(elapsedTime, quote.text, submission)
    const testResult = await TestResult.create({
      wpm,
      accuracy,
      quote,
      userId: helpers.getUserId(req)
    })
    res.redirect(`/test-results/${testResult._id}`)
  } catch (err) {
    log.fatal(err)
    res.status(500).send(err)
  }
})

router.get('/test-results/:testResultId', helpers.forceAuth, async (req, res) => {
  const testResult = await TestResult.findOne({ _id: req.params.testResultId })
  const displayAccuracy = `${testResult.accuracy * 100} %`
  res.render('test-results', {
    title: 'Test Results',
    wpm: testResult.wpm,
    accuracy: displayAccuracy,
    quote: testResult.quote,
    userId: testResult.userId,
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

module.exports = router
