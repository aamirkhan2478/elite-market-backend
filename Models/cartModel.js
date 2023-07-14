const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    totalPrice: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Cart = mongoose.model("Cart", cartSchema);
