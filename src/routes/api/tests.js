// routes/api/tests.js

const Test = require('@models/test')
const User = require('@models/user')
const auth = require('@root/auth').auth
const config = require('@root/config')
const log = config.loggers.dev()
let router = require('express').Router()

// Get all tests for current user
router.get('/', auth.required, (req, res) => {
  const { payload: { id: userId } } = req
  return Test.find({ user: userId })
    .then((tests) => {
      return res.json(tests)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

// Get a specific test
router.get('/:test_id', auth.required, (req, res) => {
  const { payload: { id: userId } } = req
  const testId = req.params.test_id
  Test.findOne({ _id: testId })
    .then((test) => {
      if (test.user._id.toString() !== userId) {
        return res.status(401).send('Hey, that test does not belong to you!')
      }
      return res.json(test)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

// Create a new test
router.post('/', auth.required, (req, res) => {
  const {
    payload: { id: userId },
    body: { wpm, accuracy, quote: quoteId }
  } = req
  Test.create({
    wpm: wpm,
    accuracy: accuracy,
    quote: quoteId,
    user: userId
  })
    .then((test) => {
      return res.json(test)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

// Update a test
router.put('/:test_id', auth.required, (req, res) => {
  const {
    payload: { id: userId },
    body: { wpm, accuracy, quote: quoteId },
    params: { test_id: testId }
  } = req
  Test.updateOne({ _id: testId }, {
    wpm: wpm,
    accuracy: accuracy,
    quote: quoteId,
    user: userId
  })
    .then((test) => {
      return res.json(test)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

// Delete a test
router.delete('/:test_id', auth.required, (req, res) => {
  const {
    payload: { id: userId },
    body: { wpm, accuracy, quote: quoteId },
    params: { test_id: testId }
  } = req
  Test.deleteOne({ _id: testId })
    .then((result) => {
      return res.json(result)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })
})

// Export Test routes
module.exports = router
