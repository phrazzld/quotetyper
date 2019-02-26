// test/proctor.js

require('module-alias/register')
const config = require('@root/config')
const app = require('@root/app')
const log = config.loggers.test()
const expect = require('chai').expect
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const check = err => {
  if (err) {
    log.fatal(err)
    expect(err).to.be.null
  }
}

before(function (done) {
  mongoose.connect(config.mongoTestUrl)
  mongoose.connection
    .once('open', function () {
      log.info('Mongoose connected to MongoDB (test)')
      done()
    })
    .on('error', function (err) {
      log.fatal(err)
    })
})

after(function (done) {
  mongoose.connection.close()
  done()
})

module.exports = {
  check
}
