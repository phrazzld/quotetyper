// test/routes.quotes.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect

const userCreds = { email: 'been@here.com', password: 'passw0rd' }
const authenticatedUser = request.agent(app)

describe('/quotes', function () {
  // Setup test environment with an authenticated user account
  before(async function () {
    const user = new User({ email: userCreds.email })
    await user.setPassword(userCreds.password)
    await user.save()
    await authenticatedUser.post('/login').send(userCreds)
  })

  // Tests
  describe('GET', function () {
    describe('Unauthenticated', function () {
      it('should 200', function (done) {
        request(app)
          .get('/quotes')
          .expect(200, done)
      })
    })
    describe('Authenticated', function () {
      it('should 200', function (done) {
        authenticatedUser
          .get('/quotes')
          .expect(200, done)
      })
    })
  })
  describe('POST', function () {
    describe('Unauthenticated', function () {
      it('should 404', function (done) {
        request(app)
          .post('/quotes')
          .send({ text: 'Arbitrary quote data', author: 'Innocent Mistake' })
          .end(function (err, res) {
            proctor.check(err)
            expect(res.statusCode).to.equal(404)
            done()
          })
      })
    })
    describe('Authenticated', function () {
      it('should 404', function (done) {
        request(app)
          .post('/quotes')
          .send({ text: 'Arbitrary quote data', author: 'Innocent Mistake' })
          .end(function (err, res) {
            proctor.check(err)
            expect(res.statusCode).to.equal(404)
            done()
          })
      })
    })
  })

  // Cleanup
  after(async function () {
    await User.remove({ email: userCreds.email })
    await authenticatedUser.get('/logout')
  })
})
