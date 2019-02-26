// test/routes.typing-test.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const Quote = require('@models/quote').model
const expect = require('chai').expect

const userCreds = { email: 'temp@user.com', password: 'temp' }
const authenticatedUser = request.agent(app)

describe('/typing-test', function () {
  // Set up authenticated user
  before(async function () {
    const user = new User({ email: userCreds.email })
    await user.setPassword(userCreds.password)
    await user.save()
    await Quote.create([
      { text: 'Maximum Effort', author: 'Deadpool' },
      { text: 'A man must always exceed his limits.', author: 'Bruce Lee' }
    ])
    await authenticatedUser.post('/login').send(userCreds)
  })

  describe('GET', function () {
    describe('Authenticated', function () {
      it('should 200', function (done) {
        authenticatedUser
          .get('/typing-test')
          .expect(200, done)
      })
    })
    describe('Unauthenticated', function () {
      it('should 200', function (done) {
        request(app)
          .get('/typing-test')
          .expect(200, done)
      })
    })
  })
  describe('POST', function () {
    describe('Authenticated', function () {
      it('should 404', function (done) {
        authenticatedUser
          .post('/typing-test')
          .expect(404, done)
      })
    })
    describe('Unauthenticated', function () {
      it('should 404', function (done) {
        request(app)
          .post('/typing-test')
          .expect(404, done)
      })
    })
  })

  // Cleanup
  after(async function () {
    await User.remove({ email: userCreds.email })
    await Quote.deleteMany({})
    await authenticatedUser.get('/logout')
  })
})
