// src/models/testresult.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Quote = require('@models/quote')

const TestResultSchema = new Schema({
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  quote: Quote.schema,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = {
  model: mongoose.model('TestResult', TestResultSchema),
  schema: TestResultSchema
}
