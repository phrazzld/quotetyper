// api-routes.js

const User = require('./models/user')
const Quote = require('./models/quote')
const Test = require('./models/test')
let router = require('express').Router()

// Quote routes
// Get all quotes
router.get('/quotes', function (req, res) {
  Quote.find().lean().exec(function (err, quotes) {
    return res.json(quotes)
  })
})

// Create a new quote
router.post('/quotes', function (req, res) {
  Quote.create({
    text: req.body.text,
    author: req.body.author,
    source: req.body.source
  }, function (err, result) {
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
router.get('/quotes/:quote_id', function (req, res) {
  Quote.findOne({ _id: req.params.quote_id }, function (err, result) {
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
router.delete('/quotes/:quote_id', function (req, res) {
  Quote.deleteOne({ _id: req.params.quote_id }, function (err, result) {
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
router.put('/quotes/:quote_id', function (req, res) {
  Quote.updateOne({
    _id: req.params.quote_id
  }, {
    text: req.body.text,
    author: req.body.author,
    source: req.body.source
  }, function (err, result) {
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

// Export API routes
module.exports = router
