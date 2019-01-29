// models/quote.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuoteSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Quote', QuoteSchema)
