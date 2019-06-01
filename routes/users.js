var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// var models = require('../models');
const passport = require('passport');
// const connectEnsure = require('connect-ensure-login');

// Load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

// Load User model
const User = require('../models/users');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
  const password = req.body.password;
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;








// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// router.get('/signup', function(req, res, next) {
//   res.render('signup');
// });

// router.post('/signup', function(req, res, next) {
//   models.users
//     .findOrCreate({
//       where: {
//         FirstName: req.body.firstName,
//         LastName: req.body.lastName,
//         Email: req.body.email,
//         Username: req.body.username,
//         Password: req.body.password
//       }
//     })
//     .spread(function(result, created) {
//       if (created) {
//         res.redirect('profile/' + result.UserId);
//       } else {
//         res.send('this user already exists');
//       }
//     });
// });


// router.get('/login', function(req, res, next) {
//   res.render('login');
// });


// router.post('/login', passport.authenticate('local', {
//   failureRedirect: '/users/login'
// }),
// function (req, res, next) {
//   res.redirect('profile/' + req.user.UserId);
// }
// );

// router.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect('/users/login');
// });



// module.exports = router;
