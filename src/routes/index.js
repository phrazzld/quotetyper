// src/routes/index.js

const router = require('express').Router()
const log = require('@root/config').loggers.dev()
const passport = require('passport')
const helpers = require('@root/helpers')
const User = require('@models/user').model

router.get('/', (req, res) => {
  log.info('GET /')
  res.render('home', {
    title: 'Wikirace',
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

router.post('/signup', (req, res) => {
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
  const finalUser = new User({ email: email, password: password })
  finalUser.setPassword(password)
  finalUser.save()
    .then(user => {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile')
      })
    })
    .catch(err => {
      log.fatal(err)
      res.status(500).send(err)
    })
})

router.get('/logout', (req, res) => {
  log.info('GET /logout')
  req.logout()
  res.redirect('/')
})

router.get('/profile', (req, res) => {
  log.info('GET /profile')
  log.info(req.user)
  res.render('profile', {
    title: 'Profile',
    email: helpers.getUserEmail(req),
    isLoggedIn: helpers.isLoggedIn(req)
  })
})

module.exports = router