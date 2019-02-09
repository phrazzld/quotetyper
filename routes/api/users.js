// routes/api/users.js

const User = require('@models/user')
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
      res.json({ user: finalUser.toAuthJSON() })
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

// Login
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password'
}), (req, res) => {
  log.info(`POST to /api/users/login`)
  log.info(req.body)
  return res.redirect('/')
})
  /*
  , (req, res) => {
  log.info(body)
  const { body: { email, password } } = req
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
  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      log.info('Error authenticating')
      log.fatal(err)
      return res.status(500).send('Error authenticating')
    } else {
      if (passportUser) {
        const user = passportUser
        user.token = passportUser.generateJWT()
        return res.json({ user: user.toAuthJSON() })
      }
      return res.status(400).info
    }
  })(req, res)
})
*/

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
