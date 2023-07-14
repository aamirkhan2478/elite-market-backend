const { default: mongoose } = require("mongoose");
const Cart = require("../Models/cartModel");
const Joi = require("joi");

exports.addCart = async (req, res) => {
  const productSchema = Joi.object({
    quantity: Joi.number().required(),
    totalPrice: Joi.number().required(),
    size: Joi.string().default("").empty(""),
    color: Joi.string().default("").empty(""),
    user: Joi.string().required(),
    product: Joi.string().required(),
  });
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  const { quantity, totalPrice, size, color, product, user } = req.body;

  try {
    const cart = new Cart({
      quantity,
      totalPrice,
      size,
      color,
      product,
      user,
    });
    await cart.save();
    return res.status(201).json({
      message: "Your product has been added to your cart",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.showCartData = async (_req, res) => {
  try {
    const cart = await Cart.find()
      .populate("product")
      .populate("user", "-password");
    res.status(200).send(cart);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      await Cart.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        message: "Cart Data deleted successfully",
      });
    } else {
      return res.status(404).json({
        error: "Cart Data not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
