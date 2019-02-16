// test/test.js

require('module-alias/register')
const should = require('chai').should()
const expect = require('chai').expect
const User = require('@models/user').model
const log = require('@root/config').loggers.test()

const pass = 'passw0rd'

describe('User model', function () {
  describe('saving new documents', function () {
    it('should fail if setPassword has not been called', function (done) {
      const bob = new User({ email: 'bob@gmail.com' })
      bob.save()
        .then(function (user) {
          log.fatal('user should not exist')
          expect(user).to.be.null
        })
        .catch(function (err) {
          expect(err).to.exist
          err.should.be.an.instanceOf(Error)
          let validationFailureMessage = 'User validation failed: salt: Path `salt` is required., hash: Path `hash` is required.'
          err.message.should.equal(validationFailureMessage)
          done()
        })
    })

    it('should fail if an invalid email is passed', function (done) {
      const jim = new User({ email: 'jimgmail.com' })
      jim.setPassword(pass)
      jim.save()
        .then(function (user) {
          log.fatal('user should not exist')
          expect(user).to.be.null
        })
        .catch(function (err) {
          expect(err).to.exist
          err.should.be.an.instanceOf(Error)
          let invalidEmailMessage = 'User validation failed: email'
          err.message.should.include(invalidEmailMessage)
          done()
        })
    })

    it('should fail if a user with that email already exists', function (done) {
      const bob = new User({ email: 'bob@gmail.com' })
      const bobby = new User({ email: 'bob@gmail.com' })
      bob.setPassword(pass)
      bobby.setPassword(pass)
      bob.save()
        .then(function (bobUser) {
          expect(bobUser).to.exist
          bobby.save()
            .then(function (bobbyUser) {
              log.fatal('bobbyUser should not exist')
              expect(bobbyUser).to.be.null
            })
            .catch(function (err) {
              expect(err).to.exist
              err.should.be.an.instanceOf(Error)
              let existingEmailMessage = 'User validation failed: email: Error, expected `email` to be unique'
              err.message.should.include(existingEmailMessage)
              done()
            })
        })
        .catch(function (err) {
          log.fatal(err)
          expect(err).to.be.null
        })
    })

    it('should succeed if setPassword has been called', function (done) {
      const bob = new User({ email: 'bob@gmail.com' })
      bob.setPassword(pass)
      bob.save()
        .then(function (user) {
          expect(user).to.not.have.any.keys('password')
          expect(user.email).to.be.a('string')
          expect(user.email).to.equal('bob@gmail.com')
          expect(user.password).to.be.undefined
          done()
        })
        .catch(function (err) {
          log.fatal(err)
          expect(err).to.be.null
        })
    })

  })

  describe('methods', function () {
    describe('setPassword', function () {
      it('should not save the password plaintext to the user document', function (done) {
        const bob = new User({ email: 'bob@gmail.com' })
        bob.setPassword(pass)
        bob.save()
          .then(function (user) {
            expect(user).to.not.have.any.keys('password')
            Object.keys(user._doc).forEach(function (key) {
              key.should.not.equal('password')
              user[key].should.not.equal(pass)
            })
            done()
          })
          .catch(function (err) {
            log.fatal(err)
            expect(err).to.be.null
          })
      })

      it('should save a salt and hash to the user document', function (done) {
        const bob = new User({ email: 'bob@gmail.com' })
        bob.setPassword(pass)
        bob.save()
          .then(function (user) {
            expect(user.hash).to.be.a('string')
            expect(user.salt).to.be.a('string')
            done()
          })
          .catch(function (err) {
            log.fatal(err)
            expect(err).to.be.null
          })
      })
    })

    describe('validatePassword', function () {
      it('should return false if given an incorrect password', function (done) {
        const bob = new User({ email: 'bob@gmail.com' })
        bob.setPassword(pass)
        bob.save()
          .then(function (user) {
            let validPassword = user.validatePassword('incorrect')
            expect(validPassword).to.be.false
            done()
          })
          .catch(function (err) {
            log.fatal(err)
            expect(err).to.be.null
          })
      })

      it('should return true if passed the correct password', function (done) {
        const bob = new User({ email: 'bob@gmail.com' })
        bob.setPassword(pass)
        bob.save()
          .then(function (user) {
            let validPassword = user.validatePassword(pass)
            expect(validPassword).to.be.true
            done()
          })
          .catch(function (err) {
            log.fatal(err)
            expect(err).to.be.null
          })
      })
    })
  })
})
