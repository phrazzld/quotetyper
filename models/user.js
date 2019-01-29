// user.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)
