var express = require('express');
var router = express.Router();
// const sqlite = require('sqlite3').verbose();
var models = require('../models');
const passport = require('passport');
const connectEnsure = require('connect-ensure-login');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Sign up');
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
        res.redirect('/users/login');
      } else {
        res.send('this user already exists');
      }
    });
});


router.get('/profile/:id', connectEnsure.ensureLoggedIn(), function(req, res) {
  if (req.user.UserId === parseInt(req.params.id)) {
    res.render('profile', {
      FirstName: req.user.FirstName,
      LastName: req.user.LastName,
      Email: req.user.Email,
      UserId: req.user.UserId,
      Username: req.user.Username
    });
  } else {
    res.send('This is not your profile');
  }
});


// router.get('/profile/:id', function(req, res, next) {
//   models.users
//     .find({
//       where: {
//         UserId: req.params.id
//       }
//     })
//     .then(user => {
//       res.render('profile', {
//         FirstName: user.FirstName,
//         LastName: user.LastName,
//         Email: user.Email,
//         UserId: user.UserId,
//         Username: user.Username
//       });
//     });
// });

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

// router.post('/login', function(req, res, next) {
//   models.users
//     .findOne({
//       where: {
//         Username: req.body.username
//       }
//     })
//     .then(user => {
//       res.redirect('profile/' + user.UserId);
//     });
// });

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users/login');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send('you reached the redirect URI');
});


module.exports = router;