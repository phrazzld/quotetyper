// src/controllers/page.js

const helpers = require('@root/helpers')

const getHome = (req, res) => {
  res.render('home', {
    title: 'QuoteTyper',
    isLoggedIn: helpers.isLoggedIn(req)
  })
}

const get401 = (req, res) => {
  res.render('401', {
    title: '401'
  })
}

const get404 = (req, res) => {
  res.render('404', {
    title: '404'
  })
}

const get500 = (req, res) => {
  res.render('500', {
    title: '500'
  })
}

module.exports = {
  getHome,
  get401,
  get404,
  get500
}
