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
  var username = req.query.username,
      email = req.query.email;

  db.get().collection('users').insertOne({
    'username': username,
    'email': email
  }, function(err, result) {
      console.log("Inserted a document into the users collection.");
      res.send("COMPLETED");
  });
});

module.exports = router;
