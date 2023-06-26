const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: objectId,
      ref: "User",
      trim: true,
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: objectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
