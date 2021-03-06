// test/models.quote.js

require('module-alias/register')
const should = require('chai').should()
const expect = require('chai').expect
const User = require('@models/user').model
const Quote = require('@models/quote').model
const log = require('@root/config').loggers.test()
const proctor = require('@test/proctor')

describe('Quote model', function () {
  before(async function () {
    try {
      await Quote.deleteMany({})
    } catch (err) {
      proctor.check(err)
    }
  })
  describe('required fields', function () {
    it('should fail to save without a text field', function (done) {
      let q = new Quote({ author: 'Deadpool' })
      q.save()
        .then(function (quote) {
          log.fatal('quote should not exist')
          expect(quote).to.be.null
        })
        .catch(function (err) {
          expect(err).to.exist
          err.should.be.an.instanceOf(Error)
          let msg = 'Quote validation failed: text: Path `text` is required.'
          err.message.should.include(msg)
          done()
        })
    })
    it('should fail to save without an author field', function (done) {
      let q = new Quote({ text: 'Maximum effort.' })
      q.save()
        .then(function (quote) {
          log.fatal('quote should not exist')
          expect(quote).to.be.null
        })
        .catch(function (err) {
          expect(err).to.exist
          err.should.be.an.instanceOf(Error)
          let msg = 'Quote validation failed: author: Path `author` is required.'
          err.message.should.include(msg)
          done()
        })
    })
    it('should fail to save with a non-string text field', function (done) {
      let q = new Quote({ text: { no: 'good' }, author: 'Deadpool' })
      q.save()
        .then(function (quote) {
          console.log(`quote.text: ${quote.text}`)
          log.fatal('quote should not exist')
          console.log(`typeof quote.text: ${typeof quote.text}`)
          expect(quote).to.be.null
        })
        .catch(function (err) {
          expect(err).to.exist
          err.should.be.an.instanceOf(Error)
          let msg = 'Cast to String failed for value'
          err.message.should.include(msg)
          done()
        })
    })
    it('should fail to save with a non-string author field', function (done) {
      let q = new Quote({ text: 'Maximum effort.', author: { hey: 'not cool' } })
      q.save()
        .then(function (quote) {
          log.fatal('quote should not exist')
          expect(quote).to.be.null
        })
        .catch(function (err) {
          expect(err).to.exist
          err.should.be.an.instanceOf(Error)
          let msg = 'Cast to String failed for value'
          err.message.should.include(msg)
          done()
        })
    })
    it('should save successfully when text and author are passed as strings',
      async function () {
        const quote = new Quote({
          text: 'Never go with a hippie to a second location.',
          author: 'Jack Donaghy'
        })
        try {
          const result = await quote.save()
          expect(result.text).to.equal('Never go with a hippie to a second location.')
          expect(result.author).to.equal('Jack Donaghy')
        } catch (err) {
          proctor.check(err)
        }
      })
  })
})
