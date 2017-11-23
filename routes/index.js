const express = require('express'),
  passport = require('passport'),
  router = express.Router(),
  User = require('../database/user'),
  Member = require('../database/member'),
  InfoUser = require('../database/infouser');

const login = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
};
  
router.get('/', login, (req, res) => {
  res.render('home', { username: req.user.username })
})

router.post('/', passport.authenticate('local', {
  successRedirect : '/',
  failureRedirect : '/login',
  failureFlash : true
}))

router.get('/login', (req, res) => {
  res.render('login',  { message : req.flash('error')[0] })
})

router.post('/login', (req, res) => {
  console.log('login')
  if(req.body.username && req.body.email && req.body.password && req.body.name) 
  {
      let user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      })

      let infoUser = new InfoUser({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name
      }) 

      user.save()
      .then( user => {
        if(user) {
          infoUser.save()
          .then( infoUser => { 
            if(infoUser) {
              res.render('login',  { message : 'Registrado Correctamente C:' })
            } else {
              res.render('index', { username: req.user.username })    
            }
          })
          .catch(err => {
            console.log(err)
            res.render('index', { username: req.user.username })
          })
        }
        else {
          res.render('index', { username: req.user.username })
        }
      })
      .catch(err => {
        console.log(err)
        res.render('index', { username: req.user.username })
      })
  } else 
  {
    res.render('index')
  }
})

router.get('/logout', login, (req, res) => {
  console.log(`${req.user.username} left`)
  req.logout()
  res.redirect('/login')
})

router.get('/profile', login, (req, res) => {
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

router.get('/profile/settings', login, (req, res) => {
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

router.get('/profile/:username', login, (req, res) => {
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