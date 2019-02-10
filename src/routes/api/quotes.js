// routes/api/quotes.js

const Quote = require('@models/quote')
const auth = require('@root/auth').auth
const config = require('@root/config')
const log = config.loggers.dev()
let router = require('express').Router()

// Get all quotes
router.get('/', auth.optional, (req, res) => {
  Quote.find().lean().exec((err, quotes) => {
    return res.json(quotes)
  })
})

// Create a new quote
router.post('/', auth.required, (req, res) => {
  Quote.create({
    text: req.body.text,
    author: req.body.author,
    source: req.body.source
  }, (err, result) => {
    if (err) {
      log.info('Error saving Quote record')
      log.fatal(err)
      res.status(500).send('Failed to save quote')
    } else {
      log.info('Successfully saved quote')
      res.json(result)
    }
  })
})

// Get a quote by _id
router.get('/:quote_id', auth.optional, (req, res) => {
  Quote.findOne({ _id: req.params.quote_id }, (err, result) => {
    if (err) {
      log.info('Error finding quote')
      log.fatal(err)
      res.status(500).send('Failed to find quote')
    } else {
      log.info('Successfully found quote')
      res.json(result)
    }
  })
})

// Delete a quote
router.delete('/:quote_id', auth.required, (req, res) => {
  Quote.deleteOne({ _id: req.params.quote_id }, (err, result) => {
    if (err) {
      log.info('Error deleting quote')
      log.fatal(err)
      res.status(500).send('Failed to deleting quote')
    } else {
      log.info('Successfully deleted quote')
      res.json(result)
    }
  })
})


// Update a quote
router.put('/:quote_id', auth.required, (req, res) => {
  Quote.updateOne({
    _id: req.params.quote_id
  }, {
    text: req.body.text,
    author: req.body.author,
    source: req.body.source
  }, (err, result) => {
    if (err) {
      log.info('Error updating quote')
      log.fatal(err)
      res.status(500).send('Failed to update quote')
    } else {
      log.info('Successfully updated quote')
      res.json(result)
    }
  })
})

// Export Quote routes
module.exports = router
