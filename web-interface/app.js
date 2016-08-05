var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// var monk = require('monk')

// // Connection URL
// var url = 'localhost:27017/test'; // Connection URL
// var db = require('monk')(url);

// var collection = db.get('ayyy')

// collection.insert([{a: 1}, {a: 2}, {a: 3}])
//   .then(function(docs) {
//     // Inserted 3 documents into the document collection
//   })
//   .then(function() {

//     return collection.update({ a: 2 }, { $set: { b: 1 } })

//   })
//   .then(function(result) {
//     // Updated the document with the field a equal to 2
//     return collection.find().then(function(x) { console.log(x ) })
//   })
//   .then(() => db.close())


module.exports = app;
