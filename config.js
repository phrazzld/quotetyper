// config.js

module.exports = {
  mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/quotetyper',
  port: process.env.PORT || 8080
}
