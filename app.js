var createError = require('http-errors');
var express = require('express');
const users = require('./routes/users');
var mongoose = require('mongoose');
const keys = require('./config/keys');
var bodyParse = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models');
var passport = require('passport');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

require('./config/passport.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


mongoose.connect(keys.mongodb.dbURI, () =>{
  console.log('connect to mongodb')
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('routes', users);
app.use('/routes', users);
app.use(require('express-session')({
  secret: 'keyboard cat',
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.render('home');
});
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

models.sequelize.sync().then(function () {
  console.log("DB Sync'd up")
});

module.exports = app;