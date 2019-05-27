var express = require('express');
var router = express.Router();
// var models = require('../models');
const passport = require('passport');
const connectEnsure = require('connect-ensure-login');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  models.users
    .findOrCreate({
      where: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Username: req.body.username,
        Password: req.body.password
      }
    })
    .spread(function(result, created) {
      if (created) {
        res.redirect('profile/' + result.UserId);
      } else {
        res.send('this user already exists');
      }
    });
});


router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login'
}),
function (req, res, next) {
  res.redirect('profile/' + req.user.UserId);
}
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users/login');
});



module.exports = router;
