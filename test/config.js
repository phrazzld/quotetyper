// test/config.js

require('module-alias/register')
const config = require('@root/config')
const expect = require('chai').expect

describe('QuoteTyper config', function () {
  it('mongoUrl should be set to something reasonable', function () {
    expect(config.mongoUrl).to.match(/mongodb:\/\//)
  })
  it('port should be set', function () {
    expect(config.port).to.be.a('number')
  })
  it('bunyan loggers should be defined for dev, prod, and test environments',
    function () {
      expect(config.loggers.dev()).to.exist
      expect(config.loggers.prod()).to.exist
      expect(config.loggers.test()).to.exist
    })
  it('avgWordLength should equal 5', function () {
    expect(config.avgWordLength).to.equal(5)
  })
})
