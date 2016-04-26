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
  // var username = req.query.username,
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
          console.log("Inserted a document into the users collection.");
          console.log(r);
          // Erroring here for some reason...
          res.send({redirect: '/signup?email='+email});
          // res.sendFile('signup.html', {root: 'views' });

      });
    }
    console.log("Found a user, skip to meals page");
    console.log(result);
    // res.send("MEALS PAGE HERE");
    res.send({redirect: '/dashboard'});
  });

});

router.get('/find', function(req, res, next) {
  var email = req.query.email;
  db.get().collection('users').findOne({
    'email': email
  }, function(err, result) {
    if (result == null) {
      res.send("ERROR");
    }
    res.json({
      'image': result.image,
      'name': result.name
    });
  });
});

module.exports = router;
