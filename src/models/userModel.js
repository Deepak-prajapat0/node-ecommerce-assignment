const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  email: {
    type: String,
    minLength: 12,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    minLength: 5,
    required: true,
    trim: true,
  },
  token:{
    type:String,
    default:null
  }
});

module.exports = mongoose.model("User", userModel);
