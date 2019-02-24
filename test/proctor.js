// test/proctor.js

require('module-alias/register')
const config = require('@root/config')
const app = require('@root/app')
const request = require('supertest')
const log = config.loggers.test()
const expect = require('chai').expect
const User = require('@models/user').model
const Quote = require('@models/quote').model
const TestResult = require('@models/test-result').model
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const check = err => {
  if (err) {
    log.fatal(err)
    expect(err).to.be.null
  }
}

const userCreds = { email: 'been@here.com', password: 'passw0rd' }
const authenticatedUser = request.agent(app)

before(async function () {
  mongoose.connect(config.mongoUrl)
  mongoose.connection
    .once('open', async function () {
      const user = new User({ email: userCreds.email })
      await user.setPassword(userCreds.password)
      await user.save()
      await authenticatedUser
        .post('/login')
        .send(userCreds)
        .end(function (err, res) {
          check(err)
          expect(res.statusCode).to.equal(302)
          expect(res.text).to.equal('Found. Redirecting to /profile')
        })
    })
    .on('error', function (err) {
      log.fatal(err)
    })
})

after(async function () {
  const usersDeleted = User.remove({})
  const quotesDeleted = Quote.remove({})
  const testResultsDeleted = TestResult.remove({})
  await usersDeleted && quotesDeleted && testResultsDeleted
  mongoose.connection.close()
})

module.exports = {
  check,
  authenticatedUser
}
