// routes/general/index.js

const router = require('express').Router()

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html')
})

module.exports = router
