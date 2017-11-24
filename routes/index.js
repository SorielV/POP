const express = require('express'),
  passport = require('passport'),
  router = express.Router(),
  User = require('../database/user'),
  Member = require('../database/member'),
  InfoUser = require('../database/infouser');

router.get('/home', (req, res) => {
  res.render('home', { username: req.user.username })
})

router.get('/logout', (req, res) => {
  console.log(`${req.user.username} left`)
  req.logout()
  res.redirect('/login')
})

module.exports = router