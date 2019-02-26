// test/routes.edit-profile.js

require('module-alias/register')
const request = require('supertest')
const log = require('@root/config').loggers.test()
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect

const userCreds = { email: 'temp@user.com', password: 'temp' }
const authenticatedUser = request.agent(app)

describe('/profile/edit', function () {
  // Set up authenticated user
  before(async function () {
    const user = new User({ email: userCreds.email })
    await user.setPassword(userCreds.password)
    await user.save()
    await authenticatedUser.post('/login').send(userCreds)
  })

  describe('GET', function () {
    describe('Unauthenticated', function () {
      it('should 302 to /401', function (done) {
        request(app)
          .get('/profile/edit')
          .end(function (err, res) {
            proctor.check(err)
            expect(res.statusCode).to.equal(302)
            expect(res.text).to.equal('Found. Redirecting to /401')
            done()
          })
      })
    })
    describe('Authenticated', function () {
      it('should 200', function (done) {
        authenticatedUser
          .get('/profile/edit')
          .end(function (err, res) {
            proctor.check(err)
            expect(res.statusCode).to.equal(200)
            done()
          })
      })
    })
  })
  describe('POST', function () {
    describe('Unauthenticated', function () {
      it('should 302 to /401', function (done) {
        request(app)
          .post('/profile/edit')
          .send({
            email: userCreds.email,
            password: userCreds.password,
            'password-confirmation': userCreds.password
          })
          .end(function (err, res) {
            proctor.check(err)
            expect(res.statusCode).to.equal(302)
            expect(res.text).to.equal('Found. Redirecting to /401')
            done()
          })
      })
    })
    describe('Authenticated', function () {
      it('should 302 to /profile', function (done) {
        authenticatedUser
          .post('/profile/edit')
          .send({
            email: userCreds.email,
            password: userCreds.password,
            'password-confirmation': userCreds.password
          })
          .end(function (err, res) {
            proctor.check(err)
            expect(res.statusCode).to.equal(302)
            expect(res.text).to.equal('Found. Redirecting to /profile')
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
