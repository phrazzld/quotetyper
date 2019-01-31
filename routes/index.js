// routes/index.js

const router = require('express').Router()
const apiRoutes = require('@routes/api/index')

router.use('/api', apiRoutes)

module.exports = router
