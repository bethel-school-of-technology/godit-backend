const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        

    },

    body: {
        type: String,
        require: true,
      
    },
    photo: {
        data: Buffer,
        contenType: String
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: "User"}
        }
    ]
     


});

module.exports = mongoose.model("Post", postSchema);





















