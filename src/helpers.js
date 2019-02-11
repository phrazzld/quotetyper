const config = require("@root/config")
const log = config.loggers.dev()
const Quote = require("@models/quote")
const User = require('@models/user')
const Test = require('@models/test')

const isLoggedIn = req => {
  log.info("Calling helpers.isLoggedIn")
  return req.user == null ? false : true
}

const getEmail = req => {
  log.info("Calling helpers.getEmail")
  return isLoggedIn(req) ? req.user.email : null
}

const resetDatabase = () => {
  User.deleteMany({})
    .then((result) => {
      log.info(result)
    })
    .catch((err) => {
      log.fatal(err)
    })
  Test.deleteMany({})
    .then((result) => {
      log.info(result)
    })
    .catch((err) => {
      log.fatal(err)
    })
  Quote.deleteMany({})
    .then((result) => {
      log.info(result)
      generateQuotes()
    })
    .catch((err) => {
      log.fatal(err)
    })
}

const generateQuotes = () => {
  Quote.create({
    text: "Maximum effort.",
    author: "Deadpool"
  })
  Quote.create({
    text: "Hierarchies are older than trees.",
    author: "Jordan B. Peterson"
  })
  Quote.create({
    text: "Being nice is something stupid people do to hedge their bets.",
    author: "Rick Sanchez"
  })
  Quote.create({
    text: "Every day we change the world. But to change the world in a way that means anything to anyone, that takes more time than most people have. It never happens all at once. It's slow. It's methodical. It's exhausting. We don't all have the stomach for it.",
    author: "Elliot Alderson"
  })
  Quote.create({
    text: "It is chiefly to my confidence in men and my ability to inspire their confidence in me that I owe my success in life.",
    author: "John D. Rockefeller"
  })
  Quote.create({
    text: "A life oriented to leisure is in the end a life oriented to death--the greatest leisure of all.",
    author: "Anne Lamott"
  })
  Quote.create({
    text: "If you always put limits on what you can do, physical or anything else, it'll spread over into the rest of your life. It'll spread into your work, into your morality, into your entire being. There are no limits. There are plateaus, but you must not stay there, you must go beyond them. If it kills you, it kills you. A man must constantly exceed his level.",
    author: "Bruce Lee"
  })
}

module.exports = {
  isLoggedIn,
  getEmail,
  generateQuotes,
  resetDatabase
}
