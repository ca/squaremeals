var express = require('express');
var router = express.Router();

var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var userList = db.get().collection('users').find({}).toArray(function(err, docs) {
    res.json(docs);
  });
});

router.get('/register', function(req, res, next) {
  var email = req.query.email
      , name = req.query.name
      , image = req.query.image;

  db.get().collection('users').findOne({
    'email': email
  }, function(err, result) {
    if (result == null) {
      db.get().collection('users').insertOne({
        'email': email,
        'image': image,
        'name': name
      }, function(err, r) {
          res.send({redirect: '/signup?email='+email});
      });
    } else {
      res.send({redirect: '/dashboard?email='+email});
    }
  });
});
// --------------------------------------------- //
//             Enter User Information            //
// This route - the enterUsrInfo acceptance test //
// --------------------------------------------- //
router.post('/register', function(req, res, next) {
  db.get().collection('users').update({
    'email': req.body.email
  }, {
    $set: {
      'weight': req.body.weight,
      'goal': req.body.goal,
      'activity_level': req.body.activity_level
    }
  });
  res.redirect('/dashboard?email='+req.body.email);
});

router.get('/find', function(req, res, next) {
  var email = req.query.email;
  db.get().collection('users').findOne({
    'email': email
  }, function(err, result) {
    if (result == null) {
      res.send("ERROR");
    }
    res.json(result);
  });
});

module.exports = router;
