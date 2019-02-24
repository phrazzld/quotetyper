// test/routes.signup.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect

const userCreds = { email: 'been@here.com', password: 'passw0rd' }
const authenticatedUser = request.agent(app)

describe('/signup', function () {
  describe('GET', function () {
    describe('Authenticated', function () {
      it('should 302 to /profile')
    })
    describe('Unauthenticated', function () {
      it('should 200')
    })
  })
  describe('POST', function () {
    describe('Authenticated', function () {
      it('should 302 to /profile')
    })
    describe('Unauthenticated', function () {
      it('should 302 to /profile')
    })
  })
})
