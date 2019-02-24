// test/helpers.js

require('module-alias/register')
const helpers = require('@root/helpers')
const expect = require('chai').expect

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
    expect(result.redirectedTo).to.equal('/login')
  })
})

describe('calculateAccuracy', function () {
  it('should return 1.0000 when quoteText and submission are the same')

  it('should return 0.0000 when submission is empty')
})

describe('calculateWPM', function () {
  it('should return 100 when duration is 600 and submission.length is 100')

  it('should return 60 when duration is 300 and submission.length is 30')
})

describe('newQuote', function () {
  it('should create a new Quote document if the db contains no duplicate')

  it('should not create a new Quote document if the db contains a duplicate')
})

describe('generateQuotes', function () {
  it('should populate the quote db with some personal favorites')
})
