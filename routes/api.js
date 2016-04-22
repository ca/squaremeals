var express = require('express')
  , request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({'API Version': '1.0'});
});

router.get('/intake', function(req, res, next) {
  // http://cff23fbd.ngrok.io/api/intake?activityLevel=5&weight=190&goal=bulk
  // Activity Level (1 - 5)
  // Weight
  // Goal (cut / bulk / maintain)
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

router.get('/generate', function(req, res, next) {
  var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByNutrients?';
  var maxcalories = 0
    , maxfat = 0
    , maxprotein = 0
    , maxcarbs = 0
    , mincalories = 0
    , minCarbs = 0
    , minfat = 0
    , minProtein = 0;
  url += 'maxcalories='+maxcalories
          +'&maxcarbs='+maxcarbs
          +'&maxfat='+maxfat
          +'&maxprotein='+maxprotein
          +'&mincalories='+mincalories
          +'&minCarbs='+minCarbs
          +'&minfat'+minfat
          +'&minProtein'+minProtein;

  request({
    url: url,
    method: 'GET',
    headers: {
      'X-Mashape-Key': 'VaEsGPU3LNmshtyBxE7TFUSmXekRp1IY7hajsnaiUW2M7IPG2S'
    }

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body) // Print the google web page.
    }
  });
  // 
  // set header with X-Mashape-Key: VaEsGPU3LNmshtyBxE7TFUSmXekRp1IY7hajsnaiUW2M7IPG2S
});
module.exports = router;
