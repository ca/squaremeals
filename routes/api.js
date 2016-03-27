var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({'API Version': '1.0'});
});

router.get('/intake', function(req, res, next) {

  var TDEE = req.query.tdee;

  var activityLevel = req.query.activityLevel;
  var weight = req.query.weight;
  var goal = req.query.goal;
  var multiplier, kilocalories, protein, fat, carbs;

  if (activityLevel < 5) { multiplier = 1.5; } 
  if (activityLevel > 2) { multiplier = 1.3; }
  if (activityLevel >= 5) { multiplier = 1.8; }
  

  console.log(req.query);

  kilocalories = weight * 10 * multiplier; // determines MAINTENANCE Calories
  if (goal == "cut") { kilocalories -= 500; }
  if (goal == "bulk") { kilocalories += 500; }

  protein = 1.3 * weight;
  fat = (kilocalories * .2) / 9;
  carbs = (kilocalories - (protein * 4) - (fat * 9)) / 4;


  res.send({
    'kilocalories': kilocalories,
    'protein': protein,
    'carbs': carbs,
    'fat': fat
  });
});

router.get('/estimate', function(req, res, next) {
  var TDEE = req.query.tdee;
  var kilocalories = req.query.intake;
  var dailyBurn = req.query.active;


  var weekIntake = kilocalories * 7;
  var weekActiveBurn = dailyBurn * 7;
  var weekRestBurn = TDEE * 7;
  var totalWeeklyCalorieDeficit = (weekActiveBurn + weekRestBurn) - weekIntake;

  res.send({
    'lbs loss / week': totalWeeklyCalorieDeficit / 3500
  });
});

module.exports = router;
