// routes/api/users.js

const User = require('@models/user').model
const passport = require('passport')
const auth = require('@root/auth').auth
const config = require('@root/config')
const log = config.loggers.dev()
let router = require('express').Router()

// User routes
// Create new user
router.post('/', auth.optional, (req, res) => {
  log.info(`POST to /api/users`)
  const { body: {
    email,
    password,
    "password-confirmation": passwordConfirmation
  } } = req
  log.info(req.body)
  if (!email) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    })
  }
  if (!password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }
  if (password !== passwordConfirmation) {
    return res.status(422).json({
      errors: {
        passwordConfirmation: 'does not match password'
      }
    })
  }

  const finalUser = new User({ email: email, password: password })
  finalUser.setPassword(password)
  finalUser.save()
    .then(() => {
      //res.json({ user: finalUser.toAuthJSON() })
      passport.authenticate('local')(req, res, function () {
        res.redirect('/')
      })
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

// Login
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), (req, res) => {
  log.info(`POST to /api/users/login`)
  log.info(req.body)
  return res.redirect('/profile')
})

// Get current user
router.get('/current', auth.required, (req, res) => {
  log.info(`GET to /api/users/current`)
  const { payload: { id } } = req
  log.info(req.body)
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400)
      }
      return res.json({ user: user.toAuthJSON() })
    })
})

// Export User routes
module.exports = router
