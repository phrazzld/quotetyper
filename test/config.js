// test/config.js

require('module-alias/register')
const config = require('@root/config')
const expect = require('chai').expect

describe('QuoteTyper config', function () {
  it('mongoUrl should be set to something reasonable')

  it('port should be set')

  it('bunyan loggers should be defined for dev, prod, and test environments')

  it('isProd should equal false if process.env.NODE_ENV !== \'production\'')

  it('isProd should equal true if process.env.NODE_ENV === \'production\'')

  it('avgWordLength should equal 5')
})
