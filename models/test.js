// models/test.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TestSchema = new Schema({
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  quote: [{ type: Schema.Types.ObjectId, ref: 'Quote' }],
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Test', TestSchema)
