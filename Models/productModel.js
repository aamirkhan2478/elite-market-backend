const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
        default: [],
      },
    ],
    brand: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    colors: [
      {
        type: String,
        default: [],
      },
    ],
    sizes: [
      {
        type: String,
        default: [],
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Product = mongoose.model("Product", productSchema);
