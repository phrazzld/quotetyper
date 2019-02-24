// test/routes.typing-test.js

require('module-alias/register')
const request = require('supertest')
const app = require('@root/app')
const proctor = require('@test/proctor')
const User = require('@models/user').model
const expect = require('chai').expect

const authenticatedUser = proctor.authenticatedUser

describe('/typing-test', function () {
  describe('GET', function () {
    describe('Authenticated', function () {
      it('should 200')
    })
    describe('Unauthenticated', function () {
      it('should 200')
    })
  })
  describe('POST', function () {
    describe('Authenticated', function () {
      it('should 302 to /test-results/:testResultId')
    })
    describe('Unauthenticated', function () {
      it('should 302 to /login')
    })
  })
})
