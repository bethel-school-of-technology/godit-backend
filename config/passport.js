const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');
const keys = require('./keys');


passport.use(
  new GoogleStrategy({
      // options for google strategy
      callbackURL:'/auth/google/redirect',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
      }, (accessToken, refreshToken, profile, done) => {
      // passport callback function
      console.log('passport callback function fired');
      console.log(profile);
  })
);



passport.use(
    'local',
    new LocalStrategy(function(username, password, done) {
      models.users
        .findOne({
          where: {
            Username: username
          }
        })
        .then(user => {
          if (!user) {
            console.log('not user');
            return done(null, false, {
              message: 'Incorrect username.'
            });
          }
          if (user.Password !== password) {
            console.log('not valid password');
            return done(null, false, {
              message: 'Incorrect password.'
            });
          }
          return done(null, user);
        })
        .catch(err => {
          if (err) {
            console.log('error');
            return done(err);
          }
        });
    })
  );
  
  passport.serializeUser((user, cb) => {
    cb(null, user.UserId);
  });
  
  passport.deserializeUser((id, cb) => {
    models.users
      .findOne({
        where: {
          UserId: id
        }
      })
      .then(user => {
        cb(null, user);
      })
      .catch(err => {
        cb(err);
      });
  });