// test/models.test-result.js

require('module-alias/register')
const should = require('chai').should()
const expect = require('chai').expect
const TestResult = require('@models/test-result').model
const User = require('@models/user').model
const Quote = require('@models/quote').model
const log = require('@root/config').loggers.test()
const proctor = require('@test/proctor')

const userCreds = { email: 'tester@test.com', password: 'passw0rd' }
const tempQuoteData = { text: 'Hello there.', author: 'General Kenobi' }

describe('TestResult model', function () {
  before(async function () {
    try {
      const user = new User({ email: userCreds.email })
      await user.setPassword(userCreds.password)
      await user.save()
      await Quote.create({ text: tempQuoteData.text, author: tempQuoteData.author })
    } catch (err) {
      proctor.check(err)
    }
  })

  describe('required fields', function () {
    it('should fail to save without a wpm field', async function () {
      try {
        const quote = await Quote.findOne({})
        const user = await User.findOne({})
        const testResult = new TestResult(
          { accuracy: 0.9876, quote: quote, userId: user._id }
        )
        await testResult.save()
      } catch (err) {
        expect(err.message).to.include('TestResult validation failed')
      }
    })
    it('should fail to save without an accuracy field', async function () {
      try {
        const quote = await Quote.findOne({})
        const user = await User.findOne({})
        const testResult = new TestResult(
          { wpm: 100, quote: quote, userId: user._id }
        )
        await testResult.save()
      } catch (err) {
        expect(err.message).to.include('TestResult validation failed')
      }
    })
    it('should fail to save if wpm is not a Number', async function () {
      try {
        const quote = await Quote.findOne({})
        const user = await User.findOne({})
        const testResult = new TestResult(
          { wpm: { not: 'a number' }, accuracy: 0.9876, quote: quote, userId: user._id }
        )
        await testResult.save()
      } catch (err) {
        expect(err.message).to.include('TestResult validation failed')
      }
    })
    it('should fail to save if accuracy is not a Number', async function () {
      try {
        const quote = await Quote.findOne({})
        const user = await User.findOne({})
        const testResult = new TestResult(
          { wpm: 100, accuracy: { not: 'a number' }, quote: quote, userId: user._id }
        )
        await testResult.save()
      } catch (err) {
        expect(err.message).to.include('TestResult validation failed')
      }
    })
    it('should save successfully if wpm and accuracy are both Numbers', async function () {
      try {
        const quote = await Quote.findOne({})
        const user = await User.findOne({})
        const testResult = new TestResult(
          { wpm: 100, accuracy: 0.9876, quote: quote, userId: user._id }
        )
        const result = await testResult.save()
        expect(result.wpm).to.equal(100)
        expect(result.accuracy).to.equal(0.9876)
        expect(result.quote.text).to.equal(quote.text)
        expect(result.quote.author).to.equal(quote.author)
        expect(result.userId).to.equal(user._id)
      } catch (err) {
        proctor.check(err)
      }
    })
  })

  // Cleanup
  after(async function () {
    try {
      await User.deleteOne({ email: userCreds.email })
      await Quote.deleteOne({ text: tempQuoteData.text, author: tempQuoteData.author })
      await TestResult.deleteMany({})
    } catch (err) {
      proctor.check(err)
    }
  })
})
