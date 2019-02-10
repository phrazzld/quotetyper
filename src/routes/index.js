// routes/index.js

const router = require('express').Router()
const genRoutes = require('@routes/general/index')
const apiRoutes = require('@routes/api/index')

router.use('/', genRoutes)
router.use('/api', apiRoutes)

module.exports = router
