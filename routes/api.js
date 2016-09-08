var express = require('express')
  , request = require('request');
var async = require('async');
var router = express.Router();

/* GET API home page. */
router.get('/', function(req, res, next) {
  res.send({'API Version': '1.0'});
});

router.post('/testing', function(req, res, next) {
	console.log(req.body);
	res.send('Thanks Bitch.');
});

router.get('/intake', function(req, res, next) {
  // http://cff23fbd.ngrok.io/api/intake?activityLevel=5&weight=190&goal=bulk
  // Activity Level (1 - 5)
  // Weight
  // Goal (cut / bulk / maintain)
  // var TDEE = req.query.tdee;

  console.log("INTAKE API CALL");

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


  res.json({
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

// --------------------------------------------- //
//              Generate Meal Plan               //
// This route is the genMealPlan acceptance test //
// --------------------------------------------- //
router.get('/generate', function(req, res, next) {

  // var maxcalories = 0
  //   , maxcarbs = 0
  //   , maxfat = 0
  //   , maxprotein = 0
  var kcal = 0;
  var mincalories = 0
    , minprotein = 0
    , mincarbs = 0
    , minfat = 0;

  var weight = req.query.weight.substring(0,4);

  console.log(weight);

  request({
    url: 'http://ead089f2.ngrok.io/api/intake?activityLevel='+parseInt(req.query.activityLevel)+'&weight='+parseInt(weight)+'&goal='+req.query.goal,
    method: 'GET'
  }, function (error, response, body) {
    console.log(error);
    console.log(body);
    kcal = body.kilocalories;
    mincalories = body.kilocalories / 3;
    minprotein = body.protein / 3;
    mincarbs = body.carbs / 3;
    minfat = body.fat / 3;

    // mincalories = maxcalories - 10;
    // minprotein = maxprotein - 10;
    // mincarbs = maxcarbs - 10;
    // minfat = maxfat - 10;
  });

  var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByNutrients?';
  // url += 'maxcalories='+maxcalories
  //         +'&maxcarbs='+maxcarbs
  //         +'&maxfat='+maxfat
  //         +'&maxprotein='+maxprotein
    url += '&mincalories='+mincalories
          +'&mincarbs='+mincarbs
          +'&minfat='+minfat
          +'&minprotein='+minprotein;

  var newUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/mealplans/generate?'
  +'targetCalories=' + kcal
  +'&timeFrame=day'


  request({
    url: url,
    method: 'GET',
    headers: {
      'X-Mashape-Key': 'VaEsGPU3LNmshtyBxE7TFUSmXekRp1IY7hajsnaiUW2M7IPG2S'
    }
  }, function (error, response, body) {
    if(error) { console.log(error); callback(true); return; }

    var d = new Date();
    var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var monthnames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    var n = weekday[d.getDay()];
    var day = d.getDate();
    var month = monthnames[d.getMonth()];
    var dateString = n + ", " + day + " " + month + " " + d.getFullYear();


    var meals = [ JSON.parse(body)[0], JSON.parse(body)[1], JSON.parse(body)[2] ];
    console.log(body);
    // db.get().collection('users').update({
    //   'email': req.body.email
    // }, {
    //   $set: {
    //     "day": {
    //       "dateString": dateString,
    //       "meals": [ body[0], body[1], body[2] ]
    //     }
    //   }
    // });
    res.json({
      "dateString": dateString,
      "meals": meals
    });
    // res.redirect('/dashboard?email='+req.body.email);


  });

  // async.parallel([
  //   function(callback) {
  //     request({
  //       url: url,
  //       method: 'GET',
  //       headers: {
  //         'X-Mashape-Key': 'VaEsGPU3LNmshtyBxE7TFUSmXekRp1IY7hajsnaiUW2M7IPG2S'
  //       }
  //     }, function (error, response, body) {
  //       if(error) { console.log(error); callback(true); return; }
  //       callback(false, JSON.parse(body));
  //     });
  //   },
  //   function(callback) {
      
  //   },
  //   function(callback) {
  //     request({
  //       url: url,
  //       method: 'GET',
  //       headers: {
  //         'X-Mashape-Key': 'VaEsGPU3LNmshtyBxE7TFUSmXekRp1IY7hajsnaiUW2M7IPG2S'
  //       }
  //     }, function (error, response, body) {
  //       if(error) { console.log(error); callback(true); return; }
  //       callback(false, JSON.parse(body));
  //     });
  //   }
  // ],
  // function(err, results) {
  //   if(err) { console.log(err); res.send(500,"Server Error"); return; }
  //   console.log(results);
  //   // res.send({api1:results[0], api2:results[1]});
  // });


  // set header with X-Mashape-Key: VaEsGPU3LNmshtyBxE7TFUSmXekRp1IY7hajsnaiUW2M7IPG2S
});
module.exports = router;
