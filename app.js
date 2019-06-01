var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const users = require('./routes/users');
// var models = require('./models');
const passport = require('passport');
var Joi =require('joi');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


require('./config/passport.js');

var app = express();




//DB connection
// mongoose.connect('mongodb://godit:teammayo1@ds349455.mlab.com:49455/godit', { 
//   useNewUrlParser: true });
// var mongoDB = 'mongodb://godit:teammayo1@ds349455.mlab.com:49455/godit';
// mongoose.connect(mongoDB, { useNewUrlParser: true });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'keyboard cat',
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));


app.use('routes', users);
app.use('/routes', users);
app.use(require('express-session')({
  secret: 'keyboard cat',
}));

app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/',(req, res) => {
  console.log(req.body);
  const schema = Joi.object().keys({
    email : Joi.string().trim().email().required(),
    password : Joi.string().min(5).max(10).required()

  });
  Joi.validate(req.body,schema,(err,result) => {
    if(err) {
      console.log(err);
      res.send('an error has ocurred');
    }
    else{
      console.log(result);
      res.send('successfully posted data');
    }
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
