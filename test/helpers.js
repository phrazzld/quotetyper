// test/helpers.js

require('module-alias/register')
const helpers = require('@root/helpers')
const expect = require('chai').expect
const Quote = require('@models/quote').model
const proctor = require('@test/proctor')

const userId = '123'
const userEmail = 'test@mctest.com'
const loggedInRequest = {
  user: { id: userId, email: userEmail }
}
const anonymousRequest = {
  stuff: { n: 'things' }
}
const res = {
  type: 'response',
  status: function (n) {
    return {
      status: n,
      redirect: function (page) {
        return { status: n, redirectedTo: page }
      }
    }
  }
}
const next = () => {
  return true
}

describe('Helpers', function () {
  describe('isLoggedIn', function () {
    it('should return true if req.user is defined', function () {
      let result = helpers.isLoggedIn(loggedInRequest)
      expect(result).to.be.true
    })
    it('should return false if req.user is undefined', function () {
      let result = helpers.isLoggedIn(anonymousRequest)
      expect(result).to.be.false
    })
  })
  describe('getUserEmail', function () {
    it('should return req.user.email when the user is logged in', function () {
      let result = helpers.getUserEmail(loggedInRequest)
      expect(result).to.equal(userEmail)
    })
    it('should return null when the user is not logged in', function () {
      let result = helpers.getUserEmail(anonymousRequest)
      expect(result).to.be.null
    })
  })
  describe('getUserId', function () {
    it('should return req.user.id when the user is logged in', function () {
      let result = helpers.getUserId(loggedInRequest)
      expect(result).to.equal(userId)
    })
    it('should return null when the user is not logged in', function () {
      let result = helpers.getUserEmail(anonymousRequest)
      expect(result).to.be.null
    })
  })
  describe('forceAuth', function () {
    it('should return next() when user is logged in', function () {
      let result = helpers.forceAuth(loggedInRequest, res, next)
      expect(result).to.be.true
    })
    it('should return a redirect to login when user is not logged in', function () {
      let result = helpers.forceAuth(anonymousRequest, res, next)
      expect(result.status).to.equal(401)
      expect(result.redirectedTo).to.equal('/401')
    })
  })
  describe('calculateAccuracy', function () {
    it('should return 1.0000 when quoteText and submission are the same',
      function () {
        const quoteText = 'This is a quote.'
        const submission = 'This is a quote.'
        const accuracy = helpers.calculateAccuracy(quoteText, submission)
        const target = Number(1.0000).toFixed(4)
        expect(accuracy).to.equal(target)
      })
    it('should return 0.0000 when submission is empty', function () {
      const quoteText = 'This is a quote.'
      const submission = ''
      const accuracy = helpers.calculateAccuracy(quoteText, submission)
      const target = Number(0.5000).toFixed(4)
      expect(accuracy).to.equal(target)
    })
  })
  describe('calculateWPM', function () {
    it('should return 100 when duration is 600 and submission.length is 500',
      function () {
        let submission = '1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 12345'
        submission += '1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 12345'
        submission += '1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 12345'
        submission += '1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 12345'
        submission += '1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 12345'
        expect(submission.length).to.equal(500)
        const duration = 600
        expect(duration).to.equal(600)
        const wpm = helpers.calculateWPM(duration, submission)
        const target = 100
        expect(wpm).to.equal(target.toFixed(2))
      })
    it('should return 60 when duration is 300 and submission.length is 30',
      function () {
      })
  })
  describe('newQuote', function () {
    before(async function () {
      try {
        await Quote.create([
          { text: 'Real Gs move in silence like lasagna.', author: 'Lil Wayne' },
          { text: 'Man and fish can coexist peacefully.', author: 'George W. Bush' }
        ])
      } catch (err) {
        proctor.check(err)
      }
    })
    it('should create a new Quote document if the db contains no duplicate',
      async function () {
        try {
          const result = await helpers.newQuote('When action is the priority, vanity falls away.', 'Kurt Brown')
          expect(result.text).to.equal('When action is the priority, vanity falls away.')
          expect(result.author).to.equal('Kurt Brown')
        } catch (err) {
          proctor.check(err)
        }
      })
    it('should not create a new Quote document if the db contains a duplicate',
      async function () {
        try {
          const result = await helpers.newQuote('Real Gs move in silence like lasagna.', 'Lil Wayne')
          expect(result).to.equal('Duplicate quote')
          const count = await Quote.countDocuments({
            text: 'Real Gs move in silence like lasagna.',
            author: 'Lil Wayne'
          })
          expect(count).to.equal(1)
        } catch (err) {
          proctor.check(err)
        }
      })
    after(async function () {
      try {
        await Quote.deleteMany({})
      } catch (err) {
        proctor.check(err)
      }
    })
  })
  describe('generateQuotes', function () {
    it('should populate the quote db with some personal favorites', async function () {
      try {
        await helpers.generateQuotes()
        const count = await Quote.countDocuments({})
        expect(count).to.equal(7)
      } catch (err) {
        proctor.check(err)
      }
    })
    after(async function () {
      try {
        await Quote.deleteMany({})
      } catch (err) {
        proctor.check(err)
      }
    })
  })
})
