// test/routes.test-results.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect

const tempUserCreds = { email: 'temp@user.com', password: 'passw0rd' }
const authenticatedUser = proctor.authenticatedUser

describe('Routes for Test Results', function () {
  // Setup test environment with an authenticated user account
  before(async function () {
    const tempUser = new User({ email: tempUserCreds.email })
    await tempUser.setPassword(tempUserCreds.password)
    await tempUser.save()
    await authenticatedUser
      .post('/login')
      .send(tempUserCreds)
      .end(function (err, res) {
        proctor.check(err)
        expect(res.statusCode).to.equal(302)
        expect(res.text).to.equal('Found. Redirecting to /profile')
      })
  })

  describe('/test-results', function () {
    describe('GET', function () {
      describe('Authenticated', function () {
        it('should 404 (...or 302 to /404...)')
      })
      describe('Unauthenticated', function () {
        it('should 404 (...or 302 to /404...)')
      })
    })
    describe('POST', function () {
      describe('Authenticated', function () {
        it('should 302 to /profile')
      })
      describe('Unauthenticated', function () {
        it('should 302 to /login')
      })
    })
  })

  describe('/test-results/:testResultId', function () {
    describe('GET', function () {
      describe('Authenticated', function () {
        describe('Authorized', function () {
          it('should 200')
        })
        describe('Unauthorized', function () {
          it('should 401 (...or 302 to /401...)')
        })
      })
      describe('Unauthenticated', function () {
        it('should 401 (...or 302 to /401...)')
      })
    })
    describe('POST', function () {
      describe('Authenticated', function () {
        describe('Authorized', function () {
          it('should 404 (...or 302 to /404...)')
        })
        describe('Unauthorized', function () {
          it('should 404 (...or 302 to /404...)')
        })
      })
      describe('Unauthenticated', function () {
        describe('Authorized', function () {
          it('should 404 (...or 302 to /404...)')
        })
        describe('Unauthorized', function () {
          it('should 404 (...or 302 to /404...)')
        })
      })
    })
  })

  // Cleanup
  after(async function () {
    await User.remove({ email: 'temp@user.com' })
  })
})
