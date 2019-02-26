// test/routes.test-results.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect
const TestResult = require('@models/test-result').model
const Quote = require('@models/quote').model

const userCreds = { email: 'temp@user.com', password: 'passw0rd' }
var testResultData = { wpm: 120, accuracy: 0.9876 }
var testResultPostData = {
  submission: 'Hey this is a submission.',
  elapsedTime: 248,
  quoteId: null
}
const authenticatedUser = request.agent(app)

describe('Routes for Test Results', function () {
  // Setup test environment with an authenticated user account
  before(async function () {
    const user = new User({ email: userCreds.email })
    try {
      await user.setPassword(userCreds.password)
      await user.save()
      await authenticatedUser.post('/login').send(userCreds)
      const quote = new Quote({ text: 'Testing testing one two', author: 'Mike One' })
      testResultData.userId = user._id
      testResultData.quote = quote
      testResultPostData.quoteId = quote._id
      const testResult = new TestResult(testResultData)
      await Promise.all([quote.save(), testResult.save()])
    } catch (err) {
      proctor.check(err)
    }
  })

  describe('/test-results', function () {
    describe('GET', function () {
      describe('Authenticated', function () {
        it('should 404', function (done) {
          authenticatedUser
            .get('/test-results')
            .expect(404, done)
        })
      })
      describe('Unauthenticated', function () {
        it('should 404', function (done) {
          request(app)
            .get('/test-results')
            .expect(404, done)
        })
      })
    })
    describe('POST', function () {
      describe('Authenticated', function () {
        it('should 302 to /test-results/:testResultId', function (done) {
          authenticatedUser
            .post('/test-results')
            .send(testResultPostData)
            .end(function (err, res) {
              proctor.expectRedirect(err, res, `${res.header.location}`)
              done()
            })
        })
      })
      describe('Unauthenticated', function () {
        it('should 302 to /401', function (done) {
          request(app)
            .post('/test-results')
            .send(testResultPostData)
            .end(function (err, res) {
              proctor.expectRedirect(err, res, '/401')
              done()
            })
        })
      })
    })
  })
  describe('/test-results/:testResultId', function () {
    describe('GET', function () {
      describe('Authenticated', function () {
        describe('Authorized', function () {
          it('should 200', async function () {
            const testResult = await TestResult.findOne({})
            await authenticatedUser
              .get(`/test-results/${testResult._id}`)
              .expect(200)
          })
        })
      })
      describe('Unauthenticated', function () {
        it('should 302 to /401', async function () {
          const testResult = await TestResult.findOne({})
          await request(app)
            .get(`/test-results/${testResult._id}`)
            .end(function (err, res) {
              proctor.expectRedirect(err, res, '/401')
            })
        })
      })
    })
    describe('POST', function () {
      describe('Authenticated', function () {
        it('should 404', async function () {
          const testResult = await TestResult.findOne({})
          await authenticatedUser
            .post(`/test-results/${testResult._id}`)
            .send(testResultData)
            .expect(404)
        })
      })
      describe('Unauthenticated', function () {
        it('should 404', async function () {
          const testResult = await TestResult.findOne({})
          await request(app)
            .post(`/test-results/${testResult._id}`)
            .send(testResultData)
            .expect(404)
        })
      })
    })
  })

  // Cleanup
  after(async function () {
    try {
      await User.deleteMany({})
      await Quote.deleteOne({ author: 'Mike One' })
      await TestResult.deleteMany({})
      await authenticatedUser.get('/logout')
    } catch (err) {
      proctor.check(err)
    }
  })
})
