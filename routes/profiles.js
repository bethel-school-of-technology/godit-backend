var express = require('express');
var router = express.Router();
// var models = require('../models');
const passport = require('passport');
const connectEnsure = require('connect-ensure-login');


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
  