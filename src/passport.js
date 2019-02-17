// passport.js

const log = require('@root/config').loggers.dev()
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('@models/user').model

passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).exec()
    if (!user) {
      return done(null, false, { message: 'Invalid username or password' })
    }
    const validPassword = await user.validatePassword(password)
    if (!validPassword) {
      return done(null, false, { message: 'Invalid username or password' })
    }
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}))

passport.serializeUser((user, done) => {
  return done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  log.info('passport.deserializeUser')
  log.info(`id: ${id}`)
  try {
    const user = await User.findById(id).exec()
    log.info('user')
    log.info(user)
    return done(null, user)
  } catch (err) {
    log.info('err')
    log.info(err)
    return done(err)
  }
})
