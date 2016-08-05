var express = require('express');
var router = express.Router();

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
module.exports = router;
