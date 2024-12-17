const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title:{
    type : String,
    require : true,
  },
  body : {
    type : String,
    require : true,
  },
  media: {
    type: [String], // Array of Cloudinary URLs
    default: [],
  },
  createdAt : {
    type : Date,
default: Date.now
  },
  updatedAt : {
    type : Date,
    default : Date.now
  }
})


module.exports = mongoose.model('Post',postSchema)