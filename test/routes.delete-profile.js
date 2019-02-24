// test/routes.delete-profile.js

require('module-alias/register')
const request = require('supertest')
const log = require('@root/config').loggers.test()
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect

const userCreds = { email: 'been@here.com', password: 'passw0rd' }
const authenticatedUser = request.agent(app)

describe('/profile/delete', function () {
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
  it('should 302 to /login if requested by an unauthenticated user')

  it('should 302 to / if requested by an authenticated user')

  // Cleanup
  after(async function () {
    await User.remove({})
  })
})
