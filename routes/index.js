var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('index.html', {root: 'views' })
});

router.get('/signup', function(req, res, next) {
	res.sendFile('signup.html', {root: 'views' })
});

router.get('/dashboard', function(req, res, next) {
	res.sendFile('viewPlan.html', {root: 'views' })
});

router.get('/auth/google', passport.authenticate('google'));
router.get('/auth/google/return',
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));


router.get('/login', function(req, res, next) {
	res.send("PLEASE LOGIN");
});

// router.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true })
// );

module.exports = router;
