const app = require('./config/config'),
  path = require('path'),
  mongoose = require('mongoose'),
  passport = require('passport');
//
mongoose.connect('mongodb://localhost/POPV2', { useMongoClient: true, promiseLibrary: global.Promise });
mongoose.Promise = global.Promise;

const indexPublic = require ('./routes/public'),
indexRouter = require('./routes/index'),
	usersRouter = require('./routes/users'),
	projectRouter = require('./routes/project'),
  profileRouter = require('./routes/profile'),
  apiProfile = require('./routes/api/profile'),
  apiProject = require('./routes/api/project'),
  apiMember = require('./routes/api/member'),
  apiRequest = require('./routes/api/request'),
	apiPost = require('./routes/api/post'),
  apiComment = require('./routes/api/comment');
  
//api 
app.use('/', indexPublic);

const authorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); 
  } else {
    res.redirect('/login');  
  }
};

app.all('*', authorized);
app
  .use('/', indexRouter)
  .use('/profile', profileRouter)
  .use('/api/profile', apiProfile)
  .use('/api/project', apiProject)
  .use('/api/member', apiMember)
  .use('/api/request', apiRequest)
  .use('/api/post', apiPost)
  .use('/api/comment', apiComment)
  //.use('/user', usersRouter)
  .use('/project', projectRouter);

app.listen(app.get('port'), () => console.log(`Server runing in port ${app.get('port')}`));