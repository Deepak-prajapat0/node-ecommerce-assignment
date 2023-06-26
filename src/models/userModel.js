const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
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
  emailToken:{
    type:String,
    default:""
  },
  emailTokenExp:{
    type:Date,
    default:new Date()
  },
  token: {
    type: String,
    default: "",
  },
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
