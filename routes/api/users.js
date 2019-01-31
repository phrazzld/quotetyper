// routes/api/users.js

const User = require('../../models/user')
const passport = require('passport')
const auth = require('../../auth')
let router = require('express').Router()

// User routes
// Create new user
router.post('/', auth.optional, (req, res) => {
  const { body: { user } } = req
  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    })
  }
  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }
  const finalUser = new User(user)
  finalUser.setPassword(user.password)
  return finalUser.save()
    .then(() => {
      res.json({ user: finalUser.toAuthJSON() })
    })
})

// Login
router.post('/login', auth.optional, (req, res) => {
  const { body: { user } } = req
  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    })
  }
  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }
  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      console.log('Error authenticating')
      console.error(err)
      res.status(500).send('Error authenticating')
    } else {
      if (passportUser) {
        const user = passportUser
        user.token = passportUser.generateJWT()
        return res.json({ user: user.toAuthJSON() })
      }
      return status(400).info
    }
  })(req, res)
})

// Get current user
router.get('/current', auth.required, (req, res) => {
  const { payload: { id } } = req
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
