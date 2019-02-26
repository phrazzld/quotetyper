// test/routes.new-quote.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const Quote = require('@models/quote').model
const expect = require('chai').expect

const userCreds = { email: 'been@here.com', password: 'passw0rd' }
const authenticatedUser = request.agent(app)
const quoteData = { text: 'Are we not doing "phrasing"?', author: 'Sterling Archer' }

describe('/quotes/new', function () {
  // Setup test environment with an authenticated user account
  before(async function () {
    try {
      const user = new User({ email: userCreds.email })
      await user.setPassword(userCreds.password)
      await user.save()
      await authenticatedUser.post('/login').send(userCreds)
    } catch (err) {
      proctor.check(err)
    }
  })

  // Tests
  describe('GET', function () {
    describe('Authenticated', function () {
      it('should 200', function (done) {
        authenticatedUser
          .get('/quotes/new')
          .expect(200, done)
      })
    })
    describe('Unauthenticated', function () {
      it('should 302 to /401', function (done) {
        request(app)
          .get('/quotes/new')
          .end(function (err, res) {
            proctor.expectRedirect(err, res, '/401')
            done()
          })
      })
    })
  })
  describe('POST', function () {
    describe('Authenticated', function () {
      it('should 302 to /quotes when sent valid quote data', function (done) {
        authenticatedUser
          .post('/quotes/new')
          .send(quoteData)
          .end(function (err, res) {
            proctor.expectRedirect(err, res, '/quotes')
            done()
          })
      })
      it('should 302 to /500 when sent invalid quote data', function (done) {
        authenticatedUser
          .post('/quotes/new')
          .send({ text: { invalid: 'quote data' }, author: 666, fake: 'field' })
          .end(function (err, res) {
            proctor.expectRedirect(err, res, '/500')
            done()
          })
      })
    })
    describe('Unauthenticated', function () {
      it('should 302 to /401', function (done) {
        request(app)
          .post('/quotes/new')
          .send(quoteData)
          .end(function (err, res) {
            proctor.expectRedirect(err, res, '/401')
            done()
          })
      })
    })
  })

  // Cleanup
  after(async function () {
    try {
      await authenticatedUser.get('/logout')
      await User.deleteOne({ email: userCreds.email })
      await Quote.deleteMany(quoteData)
    } catch (err) {
      proctor.check(err)
    }
  })
})
