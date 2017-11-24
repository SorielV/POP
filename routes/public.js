const express = require('express'),
  passport = require('passport'),
  router = express.Router(),
  User = require('../database/user'),
  Member = require('../database/member'),
  InfoUser = require('../database/infouser');

//Acceso

router.post('/', passport.authenticate('local', {
  successRedirect : '/home',
  failureRedirect : '/login',
  failureFlash : true
}))

router.get('/login', (req, res) => {
  res.render('login',  { message : req.flash('error')[0] })
})

router.post('/login', (req, res) => {
  if(req.body.username && /[A-Za-z0-9]{1,10}/.test(req.body.username) && req.body.email && req.body.password && req.body.name) 
  {
    User.findOne({ username : req.body.username})
    .then( user => {
      if(user) {
        res.render('login',  { message : 'El Usuario Existe C:' })
        res.end(200)
      } else {
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
        .then( (user, err) => {
          if(!user || err) { 
            user.remove()
            res.render('login',  { message : 'Ocurrio Un Error :C' })
            res.end(200)
          } else { 
            infoUser.save()
            .then( (infoUser,err) => { 
              if(!infoUser || err) {
                user.remove()
                res.render('login')
                res.end(200)
              }
              res.render('login',  { message : 'Registrado Correctamente C:' })
              res.end(200)
            })
            .catch(err => {
              console.log(err)
              res.render('login',  { message : 'Ocurrio Un Error :C' })
              res.end(200)
            })
          }
        })
      }
    })
  } else {
    res.render('login',  { message : 'Datos No Validos :C' })
    res.end(200)  
  }
})


module.exports = router