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
    await authenticatedUser.post('/login').send(userCreds)
  })

  // Tests
  describe('GET', function () {
    describe('Authenticated', function () {
      it('should 200')
    })
    describe('Unauthenticated', function () {
      it('should 302 to /401')
    })
  })
  describe('POST', function () {
    describe('Authenticated', function () {
      it('should 302 to /quotes when sent valid quote data')
      it('should 302 to /500 when sent invalid quote data')
    })
    describe('Unauthenticated', function () {
      it('should 302 to /login')
    })
  })

  // Cleanup
  after(async function () {
    await authenticatedUser.get('/logout')
    await User.remove({ email: userCreds.email })
  })
})
