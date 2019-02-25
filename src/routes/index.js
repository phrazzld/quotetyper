// src/routes/index.js

const router = require('express').Router()
const log = require('@root/config').loggers.dev()
const passport = require('passport')
const helpers = require('@root/helpers')
const User = require('@models/user').model
const Quote = require('@models/quote').model
const TestResult = require('@models/test-result').model
const userController = require('@controllers/user')
const quoteController = require('@controllers/quote')
const testResultController = require('@controllers/test-result')
const pageController = require('@controllers/page')

router.get('/', pageController.getHome)
router.get('/401', pageController.get401)
router.get('/404', pageController.get404)
router.get('/500', pageController.get500)

router.get('/login', userController.getLogin)
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  userController.postLogin
)
router.get('/signup', userController.getSignup)
router.post('/signup', userController.postSignup)
router.get('/logout', helpers.forceAuth, userController.getLogout)
router.get('/profile', helpers.forceAuth, userController.getProfile)
router.get('/profile/edit', helpers.forceAuth, userController.getProfileEdit)
router.post('/profile/edit', helpers.forceAuth, userController.postProfileEdit)
router.post('/profile/delete', helpers.forceAuth, userController.postProfileDelete)

router.get('/quotes', quoteController.getQuotes)
router.get('/quotes/new', helpers.forceAuth, quoteController.getNewQuote)
router.post('/quotes/new', helpers.forceAuth, quoteController.postNewQuote)

router.get('/typing-test', testResultController.getTypingTest)
router.post('/test-results', helpers.forceAuth, testResultController.postTestResults)
router.get('/test-results/:testResultId',
  helpers.forceAuth,
  testResultController.getTestResult
)

module.exports = router
