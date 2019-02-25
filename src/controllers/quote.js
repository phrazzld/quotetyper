// src/controllers/quote.js

const helpers = require('@root/helpers')
const log = require('@root/config').loggers.dev()
const Quote = require('@models/quote').model

const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({})
    res.render('quotes', {
      title: 'Quotes',
      isLoggedIn: helpers.isLoggedIn(req),
      quotes: quotes
    })
  } catch (err) {
    log.fatal(err)
    res.status(500).redirect('/500')
  }
}

const getNewQuote = (req, res) => {
  res.render('new-quote', {
    title: 'New Quote',
    isLoggedIn: helpers.isLoggedIn(req)
  })
}

const postNewQuote = async (req, res) => {
  const { body: {
    'new-quote-text': quoteText,
    'new-quote-author': quoteAuthor
  } } = req
  try {
    await helpers.newQuote(quoteText, quoteAuthor, helpers.getUserId(req))
    res.redirect('/quotes')
  } catch (err) {
    log.fatal(err)
    res.status(500).redirect('/500')
  }
}

module.exports = {
  getQuotes,
  getNewQuote,
  postNewQuote
}
