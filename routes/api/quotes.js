// routes/api/quotes.js

const Quote = require('../../models/quote')
const passport = require('passport')
const auth = require('../../auth')
let router = require('express').Router()

// Get all quotes
router.get('/', (req, res) => {
  Quote.find().lean().exec((err, quotes) => {
    return res.json(quotes)
  })
})

// Create a new quote
router.post('/', (req, res) => {
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
router.get('/:quote_id', (req, res) => {
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
router.delete('/:quote_id', (req, res) => {
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
router.put('/:quote_id', (req, res) => {
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

// Export Quote routes
module.exports = router
