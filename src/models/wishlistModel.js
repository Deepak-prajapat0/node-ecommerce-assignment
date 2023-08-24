const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: objectId,
      ref: "User",
      trim: true,
      required: true,
    },
    products: [
         {
          type: objectId,
          ref: "Product",
          required: true,
        }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
