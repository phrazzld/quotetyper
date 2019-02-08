// routes/general/index.js

const router = require('express').Router()

router.get('/', (req, res) => {
  res.send('Hello World, from QuoteTyper!')
})

module.exports = router
