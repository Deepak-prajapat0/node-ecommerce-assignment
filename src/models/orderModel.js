const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const orderSchema = new mongoose.Schema({
  userId: {
    type: objectId,
    ref: "User",
    required: true,
    trim:true
  },
  orderDetails: {
    products: [
      {
        productId: {
          type: objectId,
          ref: "Product",
          required: true,
          trim:true
        },
        quantity: {
          type: Number,
          required: true,
          trim:true
        },
        _id: false,
      },
    ],
    totalItems: {
      type: Number,
      required: true,
      trim:true
    },
    totalPrice: {
      type: Number,
      required: true,
      trim:true
    },
  },
  shippingDetails: {
    name: {
      type: String,
      required: true,
      trim:true
    },
    phone: {
      type: Number,
      required: true,
      trim:true
    },
    address: {
      house: {
        type: String,
        required: true,
        trim:true
      },
      street: {
        type: String,
        required: true,
        trim:true
      },
      city: {
        type: String,
        required: true,
        trim:true
      },
      state: {
        type: String,
        required: true,
        trim:true
      },
      pincode: {
        type: Number,
        required: true,
        trim:true,
        minLength: 6,
        maxLength: 6,
      },
    },
  },
  status:{
    type:String,
    enum:["pending","Delivered","Canceled"],
    default:"pending"
  }
});


module.exports = mongoose.model("Order",orderSchema)