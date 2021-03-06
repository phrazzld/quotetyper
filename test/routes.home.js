// test/routes.home.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect

const userCreds = { email: 'temp@user.com', password: 'temp' }
const authenticatedUser = request.agent(app)

describe('/', function () {
  // Set up authenticated user
  before(async function () {
    const user = new User({ email: userCreds.email })
    await user.setPassword(userCreds.password)
    await user.save()
    await authenticatedUser.post('/login').send(userCreds)
  })

  // Tests
  describe('Unauthenticated', function () {
    it('should 200', function (done) {
      request(app)
        .get('/')
        .expect(200, done)
    })
  })
  describe('Authenticated', function () {
    it('should 200', function (done) {
      authenticatedUser
        .get('/')
        .expect(200, done)
    })
  })

  // Cleanup
  after(async function () {
    await User.remove({ email: userCreds.email })
    await authenticatedUser.get('/logout')
  })
})
