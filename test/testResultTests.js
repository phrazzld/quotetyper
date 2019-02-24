// test/testResultTests.js

require('module-alias/register')
const should = require('chai').should()
const expect = require('chai').expect
const TestResult = require('@models/testresult').model
const User = require('@models/user').model
const Quote = require('@models/quote').model
const log = require('@root/config').loggers.test()

const existingUser = { email: 'tester@test.com', password: 'passw0rd' }
const existingQuote = { text: 'Hello there.', author: 'General Kenobi' }

describe('TestResult model', function () {
  before(async function () {
    try {
      const user = new User({ email: existingUser.email })
      await user.setPassword(existingUser.password)
      await user.save()
      await Quote.create({ text: existingQuote.text, author: existingQuote.author })
    } catch (err) {
      log.fatal(err)
    }
  })

  describe('required fields', function () {
    it('should fail to save without a wpm field')

    it('should fail to save without an accuracy field')

    it('should fail to save if wpm is not a Number')

    it('should fail to save if accuracy is not a Number')

    it('should save successfully if wpm and accuracy are both Numbers')
  })
})
