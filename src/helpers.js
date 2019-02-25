// src/helpers.js

const config = require('@root/config')
const log = config.loggers.dev()
const levenshtein = require('fast-levenshtein')
const Quote = require('@models/quote').model

const isLoggedIn = req => {
  return req.user != null
}

const getUserEmail = req => {
  return isLoggedIn(req) ? req.user.email : null
}

const getUserId = req => {
  return isLoggedIn(req) ? req.user.id : null
}

const forceAuth = (req, res, next) => {
  if (req.user != null) {
    return next()
  }
  return res.status(401).redirect('/401')
}

const calculateAccuracy = (quoteText, submission) => {
  let distance = levenshtein.get(quoteText, submission)
  let denom = quoteText.length + distance
  let accuracy = quoteText.length / denom
  return accuracy.toFixed(4)
}

const calculateWPM = (duration, submission) => {
  let minutes = Number(duration) / 60 / 10
  minutes = minutes.toFixed(2)
  let wpm = submission.length / config.avgWordLength / minutes
  wpm = wpm.toFixed(2)
  return wpm
}

const newQuote = async (text, author, submittedBy) => {
  const quote = new Quote({ text, author, submittedBy })
  const exists = await Quote.findOne({ text, author }).count() > 0
  if (exists) {
    log.info(`Not saving duplicate quote\n${text}\n\t-- ${author}\n`)
  } else {
    log.info(`Saving new quote\n${text}\n\t-- ${author}\n`)
    await quote.save()
  }
}

const generateQuotes = () => {
  const quotes = []
  newQuote(`Maximum effort.`, `Deadpool`)
  newQuote(`Hierarchies are older than trees.`, `Jordan B. Peterson`)
  newQuote(`Being nice is something stupid people do to hedge their bets.`, `Rick Sanchez`)
  newQuote(`Every day we change the world. But to change the world in a way that means anything to anyone, that takes more time than most people have. It never happens all at once. It's slow. It's methodical. It's exhausting. We don't all have the stomach for it.`, `Elliot Alderson`)
  newQuote(`It is chiefly to my confidence in men and my ability to inspire their confidence in me that I owe my success in life.`, `John D. Rockefeller`)
  newQuote(`A life oriented to leisure is in the end a life oriented to death--the greatest leisure of all.`, `Anne Lamott`)
  newQuote(`If you always put limits on what you can do, physical or anything else, it'll spread over into the rest of your life. It'll spread into your work, into your morality, into your entire being. There are no limits. There are plateaus, but you must not stay there, you must go beyond them. If it kills you, it kills you. A man must constantly exceed his level.`, `Bruce Lee`)
}

module.exports = {
  isLoggedIn,
  getUserEmail,
  getUserId,
  forceAuth,
  newQuote,
  generateQuotes,
  calculateAccuracy,
  calculateWPM,
}
