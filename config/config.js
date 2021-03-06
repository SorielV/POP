const express = require('express'),
  app = express(),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  expressSession = require('express-session'),
  flash = require('express-flash'),
  User = require('../database/user');

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ 
      username: username 
    })
    .then((user, err) => {
      if (!err && user.password === password) {
        console.log(`User Join ${user.username}`)
        return done(null, user);
      }
      return done(null, false, { message: 'User or password Incorrecto' });
    });
  }
));

passport.serializeUser((user, done) => done(null, user) );
passport.deserializeUser((user, done) => done(null, user) );

app
  .set('views', path.join(__dirname, '../views'))
  .set('view engine', 'ejs')
  .set('port', process.env.PORT || 3000);
app
  //.use(logger('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(flash())
  .use(cookieParser())
  .use(express.static(path.join(__dirname, '../public')))
  .use(expressSession({ secret: 'mySecretKey' }))
  .use(passport.initialize())
  .use(passport.session());

module.exports = app;
