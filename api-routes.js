// api-routes.js

const User = require('./models/user')
const Quote = require('./models/quote')
const Test = require('./models/test')
let router = require('express').Router()
const mongoose = require('mongoose')
const auth = require('./auth')
const passport = require('passport')

// Quote routes
// Get all quotes
router.get('/quotes', (req, res) => {
  Quote.find().lean().exec((err, quotes) => {
    return res.json(quotes)
  })
})

// Create a new quote
router.post('/quotes', (req, res) => {
  Quote.create({
    text: req.body.text,
    author: req.body.author,
    source: req.body.source
  }, (err, result) => {
    if (err) {
      console.log('Error saving Quote record')
      console.error(err)
      res.status(500).send('Failed to save quote')
    } else {
      console.log('Successfully saved quote')
      res.json(result)
    }
  })
})

// Get a quote by _id
router.get('/quotes/:quote_id', (req, res) => {
  Quote.findOne({ _id: req.params.quote_id }, (err, result) => {
    if (err) {
      console.log('Error finding quote')
      console.error(err)
      res.status(500).send('Failed to find quote')
    } else {
      console.log('Successfully found quote')
      res.json(result)
    }
  })
})

// Delete a quote
router.delete('/quotes/:quote_id', (req, res) => {
  Quote.deleteOne({ _id: req.params.quote_id }, (err, result) => {
    if (err) {
      console.log('Error deleting quote')
      console.error(err)
      res.status(500).send('Failed to deleting quote')
    } else {
      console.log('Successfully deleted quote')
      res.json(result)
    }
  })
})


// Update a quote
router.put('/quotes/:quote_id', (req, res) => {
  Quote.updateOne({
    _id: req.params.quote_id
  }, {
    text: req.body.text,
    author: req.body.author,
    source: req.body.source
  }, (err, result) => {
    if (err) {
      console.log('Error updating quote')
      console.error(err)
      res.status(500).send('Failed to update quote')
    } else {
      console.log('Successfully updated quote')
      res.json(result)
    }
  })
})

// User routes
// Create new user
router.post('/users', auth.optional, (req, res) => {
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
router.get('/users/current', auth.required, (req, res) => {
  const { payload: { id } } = req
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400)
      }
      return res.json({ user: user.toAuthJSON() })
    })
})

// Export API routes
module.exports = router
