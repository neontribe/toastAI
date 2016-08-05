var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/api/users/signup', function(req, res, next) {
  res.render('index', { title: 'Express' });
  req.body.name
  req.body.password
});
router.post('/api/users/all', function(req, res, next) {
  res.render('index', { title: 'Express' });
  req.body.name
  req.body.password
});


router.post('/api/toast/all/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  find with userID
  [{
  	userID: 
  	level:

  }]

  ->[{toast}]
});
router.post('/api/toast/:id', function(req, res, next) {
  res.render('index', { title: 'Express' });
  req.body.userID
  {toast}
});
router.post('/api/toast/send_request', function(req, res, next) {
  res.render('index', { title: 'Express' });
  {setting: x}
});
router.post('/api/toast/create', function(req, res, next) {
  res.render('index', { title: 'Express' });
  {toast}

});
router.post('/api/toast/:id/update', function(req, res, next) {
  res.render('index', { title: 'Express' });
  {toast}
  req.body.id
});
router.post('/api/toast/recommended', function(req, res, next) {
  res.render('index', { title: 'Express' });
  {toast}
});

module.exports = router;


