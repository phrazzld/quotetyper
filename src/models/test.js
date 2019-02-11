// models/test.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('@models/user')
const Quote = require('@models/quote')

const TestSchema = new Schema({
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  /*
  quote: {
    type: Schema.Types.ObjectId,
    ref: 'Quote'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  */
  quote: Quote.schema,
  user: User.schema
}, {
  timestamps: true
})

module.exports = {
  model: mongoose.model('Test', TestSchema),
  schema: TestSchema
}
