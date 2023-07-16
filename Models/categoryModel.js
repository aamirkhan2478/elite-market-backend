const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Category = mongoose.model("Category", categorySchema);
