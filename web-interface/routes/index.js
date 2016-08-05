var express = require('express');
var router = express.Router();

var toastduinoLib = require('../toastduino');
var recommendedToast = require('../predictive-toast')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signin', function(req, res, next) {
  res.render('user', { title: 'Express' });
});
router.get('/toast', function(req, res, next) {
  res.render('toast', { title: 'Express' });
});
router.get('/rate', function(req, res, next) {
  res.render('rate', { title: 'Express' });
});
router.get('/toast/view', function(req, res, next) {
  res.render('view_toast', { title: 'Express' });
});


router.get('/api/toast', function(req, res, next) {
  if (toastduinoLib.getToastduinos().length > 0 ) {
  	var seconds = parseInt(req.params.seconds);
  	try {
  		toastduinoLib.getToastduinos()[0].toast(seconds);
  	} catch (error) {
  		res.json({'error': error.message});
  		return;
  	}
  	res.json({'ok': 'Blazing'});
  	return;
  }
  res.json({'error': 'No toasters available'});
});
router.get('/api/toasters', function(req, res, next) {
  var toastduinos = toastduinoLib.getToastduinos();
  var jsonResponse = [];
  for (var toastduinoIndex in toastduinos) {
  	var toastduino = toastduinos[toastduinoIndex];
  	var jsonRepresentation = {};
  	jsonRepresentation.status = toastduino.getStatus();
  	jsonRepresentation.ready = toastduino.isReady();
  	jsonResponse.push(jsonRepresentation);
  }
  res.json(jsonResponse);
});

router.post('/api/recommended_toast', function(req, res, next) {
	var toasts = req.body.toasts

	var time = recommendedToast.predictTime(toasts)
	res.json({
		"time": time
	})
})

module.exports = router;

