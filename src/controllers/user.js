// src/controllers/user.js

const helpers = require('@root/helpers')
const log = require('@root/config').loggers.dev()
const passport = require('passport')
const User = require('@models/user').model
const TestResult = require('@models/test-result').model

const getLogin = (req, res) => {
  res.render('login', {
    title: 'Login',
    isLoggedIn: helpers.isLoggedIn(req)
  })
}

const postLogin = (req, res) => {
  res.redirect('/profile')
}

const getSignup = (req, res) => {
  res.render('signup', {
    title: 'Signup',
    isLoggedIn: helpers.isLoggedIn(req)
  })
}

const postSignup = async (req, res) => {
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
    res.status(500).redirect('/500')
  }
}

const getLogout = (req, res) => {
  req.logout()
  res.redirect('/')
}

const getProfile = async (req, res) => {
  const testResults = await TestResult.find({ userId: helpers.getUserId(req) })
  res.render('profile', {
    title: 'Profile',
    email: helpers.getUserEmail(req),
    testResults: testResults,
    isLoggedIn: helpers.isLoggedIn(req)
  })
}

const getProfileEdit = (req, res) => {
  res.render('edit-profile', {
    title: 'Edit Profile',
    email: helpers.getUserEmail(req),
    isLoggedIn: helpers.isLoggedIn(req)
  })
}

const postProfileEdit = async (req, res) => {
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
    res.status(500).redirect('/500')
  }
}

const postProfileDelete = async (req, res) => {
  try {
    await User.deleteOne({ _id: helpers.getUserId(req) })
    res.redirect('/')
  } catch (err) {
    log.fatal(err)
    res.status(500).redirect('/500')
  }
}

module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getLogout,
  getProfile,
  getProfileEdit,
  postProfileEdit,
  postProfileDelete
}
