const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
      phone: {
      type: Number,
      trim: true,
    },
    email: {
      type: String,
      minLength: 12,
      required: true,
      trim: true,
      unique:true
    },
    password: {
      type: String,
      minLength: 5,
      required: true,
      trim: true,
    },
    emailToken: {
      type: String,
      default: "",
    },
    emailTokenExp: {
      type: Date,
      default: new Date(),
    },
    tokens: [
      {
        type: Object,
      },
    ],
    address:[
      {
        house:{
          type:String,
          trim:true
        },
        street: {
          type: String,
          trim: true
        },
        city: {
          type: String,
          trim: true
        },
        state: {
          type: String,
          trim: true
        },
        pincode: {
          type: Number,
          trim: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
