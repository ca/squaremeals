var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var passport = require('passport')
  , LocalStrategy = require('passport-local')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;;

var api = require('./routes/api');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var db = require('./db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.get('/auth/google', passport.authenticate('google', { scope: 'openid profile email' })); // ['openid', 'profile', 'email'] }));//passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));
app.get('/auth/google/callback', function() {
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/fail'
    });
});
app.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
});


// database connection
var url = 'mongodb://localhost:27017/mealbase';
db.connect(url, function(err, database) {
  assert.equal(null, err);
  console.log("Connected successfully to server.");

  // authentication
  passport.use(new GoogleStrategy({
      clientID: process.env.SQUAREMEALS_GOOGLE_CLIENT_ID,
      clientSecret: process.env.SQUAREMEALS_GOOGLE_CLIENT_SECRET,

      callbackURL: "http://locahost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile); //profile contains all the personal data returned 
      done(null, profile)
    }
  ));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
