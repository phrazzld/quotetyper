// test/routes.new-quote.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect

const userCreds = { email: 'been@here.com', password: 'passw0rd' }
const authenticatedUser = request.agent(app)

describe('/quotes/new', function () {
  // Setup test environment with an authenticated user account
  before(async function () {
    const user = new User({ email: userCreds.email })
    await user.setPassword(userCreds.password)
    await user.save()
    await authenticatedUser
      .post('/login')
      .send(userCreds)
      .end(function (err, res) {
        proctor.check(err)
        expect(res.statusCode).to.equal(302)
        expect(res.text).to.equal('Found. Redirecting to /profile')
      })
  })

  // Tests
  describe('GET', function () {
    describe('authenticated', function () {
      it('should 200')
    })
    describe('unauthenticated', function () {
      it('should 302 to /login')
    })
  })
  describe('POST', function () {
    describe('authenticated', function () {
      it('should 302 to /quotes when sent valid credentials')
    })
    describe('unauthenticated', function () {
      it('should 302 to /login')
    })
  })

  // Cleanup
  after(async function () {
    await User.remove({})
  })
})
