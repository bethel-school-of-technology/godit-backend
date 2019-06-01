// const mongoose = require('mongoose');
// const Joi = require('joi');
//  const Schema = mongoose.Schema;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = User = mongoose.model("users", UserSchema);    
   
// const Users = mongoose.model("Users", usersSchema);
// function validateUsers(users) {
//     const schema = {
//         FirstName : Joi.string()
//         .min()
//         .max()
//         .require(),
        
//         LastName: Joi.string()
//         .min()
//         .max()
//         .require(),

//         Email : Joi.string()
//         .min()
//         .max()
//         .require()
//         .email(),

//         Username : Joi.string()
//         .min()
//       .max()
//       .required(),

//       Password : Joi.string()
//       .min()
//       .max()
//       .required()
//     };
    
//     return Joi.validate(users, schema);

// }


// exports.Users = Users;
// exports.validate = validateUsers;