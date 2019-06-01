const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};












// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const models = require('../models');


// passport.use(
//     'local',
//     new LocalStrategy(function(username, password, done) {
//       models.users
//         .findOne({
//           where: {
//             Username: username
//           }
//         })
//         .then(user => {
//           if (!user) {
//             console.log('not user');
//             return done(null, false, {
//               message: 'Incorrect username.'
//             });
//           }
//           if (user.Password !== password) {
//             console.log('not valid password');
//             return done(null, false, {
//               message: 'Incorrect password.'
//             });
//           }
//           return done(null, user);
//         })
//         .catch(err => {
//           if (err) {
//             console.log('error');
//             return done(err);
//           }
//         });
//     })
//   );
  
//   passport.serializeUser((user, cb) => {
//     cb(null, user.UserId);
//   });
  
//   passport.deserializeUser((id, cb) => {
//     models.users
//       .findOne({
//         where: {
//           UserId: id
//         }
//       })
//       .then(user => {
//         cb(null, user);
//       })
//       .catch(err => {
//         cb(err);
//       });
//   });