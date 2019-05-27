const mongoose = require('mongoose');
const Joi = require('joi');
 

const usersSchema = new mongoose.Schema ({

        FirstName: {
            type: String,
            require: true
        },
        LastName: {
type: String,
require: true
        },

        Email: {
            type: String,
            require : true,
            unique : true,
        },
       
        Username:  {
            type: String,
            unique: true,
        },
        Password: {
            type: String,
            require: true,
        },
    });
    
   
const Users = mongoose.model("Users", usersSchema);
function validateUsers(users) {
    const schema = {
        FirstName : Joi.string()
        .min()
        .max()
        .require(),
        
        LastName: Joi.string()
        .min()
        .max()
        .require(),

        Email : Joi.string()
        .min()
        .max()
        .require()
        .email(),

        Username : Joi.string()
        .min()
      .max()
      .required(),

      Password : Joi.string()
      .min()
      .max()
      .required()
    };
    
    return Joi.validate(users, schema);

}


exports.Users = Users;
exports.validate = validateUsers;