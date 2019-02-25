// src/controllers/test-result.js

const helpers = require('@root/helpers')
const log = require('@root/config').loggers.dev()
const TestResult = require('@models/test-result').model
const Quote = require('@models/quote').model

const getTypingTest = async (req, res) => {
  try {
    const quoteCount = await Quote.count()
    const random = Math.floor(Math.random() * quoteCount)
    const quote = await Quote.findOne({}).skip(random)
    res.render('typing-test', {
      title: 'Typing Test',
      quote: quote,
      isLoggedIn: helpers.isLoggedIn(req)
    })
  } catch (err) {
    log.fatal(err)
    res.status(500).redirect('/500')
  }
}

const postTestResults = async (req, res) => {
  const { body: { submission, elapsedTime, quoteId } } = req
  try {
    const quote = await Quote.findOne({ _id: quoteId })
    const wpm = helpers.calculateWPM(elapsedTime, submission)
    const accuracy = helpers.calculateAccuracy(quote.text, submission)
    const testResult = await TestResult.create({
      wpm,
      accuracy,
      quote,
      userId: helpers.getUserId(req)
    })
    res.redirect(`/test-results/${testResult._id}`)
  } catch (err) {
    log.fatal(err)
    res.status(500).redirect('/500')
  }
}

const getTestResult = async (req, res) => {
  const testResult = await TestResult.findOne({ _id: req.params.testResultId })
  const displayAccuracy = `${testResult.accuracy * 100} %`
  res.render('test-results', {
    title: 'Test Results',
    wpm: testResult.wpm,
    accuracy: displayAccuracy,
    quote: testResult.quote,
    userId: testResult.userId,
    isLoggedIn: helpers.isLoggedIn(req)
  })
}

module.exports = {
  getTypingTest,
  postTestResults,
  getTestResult
}
