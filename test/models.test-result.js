// test/models.test-result.js

require('module-alias/register')
const should = require('chai').should()
const expect = require('chai').expect
const TestResult = require('@models/test-result').model
const User = require('@models/user').model
const Quote = require('@models/quote').model
const log = require('@root/config').loggers.test()

const tempUserCreds = { email: 'tester@test.com', password: 'passw0rd' }
const tempQuoteData = { text: 'Hello there.', author: 'General Kenobi' }

describe('TestResult model', function () {
  before(async function () {
    try {
      const tempUser = new User({ email: tempUserCreds.email })
      await tempUser.setPassword(tempUserCreds.password)
      await tempUser.save()
      await Quote.create({ text:tempQuoteData.text, author: tempQuoteData.author })
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

  // Cleanup
  after(async function () {
    const userDeleted = User.remove({ email: tempUserCreds.email })
    const quoteDeleted = Quote.remove({
      text: tempQuoteData.text,
      author: tempQuoteData.author
    })
    await userDeleted && quoteDeleted
  })
})
