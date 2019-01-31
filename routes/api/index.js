// routes/api/index.js

const router = require('express').Router()
const quoteRoutes = require('@routes/api/quotes')
//const testRoutes = require('./tests')
const userRoutes = require('@routes/api/users')

router.use('/quotes', quoteRoutes)
//router.use('/tests', testRoutes)
router.use('/users', userRoutes)

module.exports = router
