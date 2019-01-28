// api-routes.js

let router = require('express').Router()

// GET home route
router.get('/', function (req, res) {
  res.json({ message: 'Welcome to QuoteTyper!' })
})

// Export API routes
module.exports = router
