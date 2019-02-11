const config = require('@root/config')
const log = config.loggers.dev()

const isLoggedIn = req => {
  log.info('Calling helpers.isLoggedIn')
  return req.user == null ? false : true
}

const getEmail = req => {
  log.info('Calling helpers.getEmail')
  return isLoggedIn(req) ? req.user.email : null
}

module.exports = {
  isLoggedIn,
  getEmail
}
