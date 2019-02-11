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
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = {
  model: mongoose.model('Quote', QuoteSchema),
  schema: QuoteSchema
}
