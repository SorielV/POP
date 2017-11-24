const express = require('express'),
  router = express.Router(),
  Member = require('../database/member'),
  InfoUser = require('../database/infouser');

router.get('/', (req, res) => {
  InfoUser.findOne({ 
    username : req.user.username
  })
  .then((infoUser, err) => {
    if(infoUser) {
      Member.find({ 
        username: req.user.username
      }).select('project -_id')
      .then((projects, err) => {
        if(projects) {
          res.render('profile', { user : infoUser, projects})
        } else {
          res.render('profile', { user : infoUser, projects: []})
        }
      })
      .catch(err => {
        res.render('profile', { user : infoUser, projects: []})
        console.log(err) 
      }) 
    } else {
      res.render('error')
    }
  })
  .catch(err => {
    console.log(err) 
    res.render('error')
  }) 
})

router.get('/settings', (req, res) => {
  InfoUser.findOne({ 
    username : req.user.username
  })
  .then((infoUser, err) => {
    if(infoUser) {
      res.render('settings', { username: req.user.username, user: infoUser })
    } else {
      res.render('error')
    }
  })
  .catch(err => { 
    console.log(err)
    res.render('error')
  })
})

router.get('/:username', (req, res) => {
  InfoUser.findOne({ 
    username : req.params.username
  })
  .then((infoUser, err) => {
    if(infoUser) {
      Member.find({ 
        username: req.params.username
      }).select('project -_id')
      .then((projects, err) => {
        if(projects) {
          res.render('profile', { username: req.user.username, user : infoUser, projects})
        } else {
          res.render('profile', { username: req.user.username, user : infoUser, projects: []})
        }
      })
      .catch(err => {
        res.render('profile', { username: req.user.username, user : infoUser, projects: []})
        console.log(err) 
      }) 
    } else {
      res.render('error')
    }
  })
  .catch(err => {
    console.log(err) 
    res.render('error')
  }) 
})

module.exports = router