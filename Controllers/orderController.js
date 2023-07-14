const Joi = require("joi");
const Order = require("../Models/orderModel");
const OrderItem = require("../Models/orderItemModel");
const { default: mongoose } = require("mongoose");
const Product = require("../Models/productModel");

//api/order/add-order
//Only for logged In users
exports.addOrder = async (req, res) => {
  const orderSchema = Joi.object({
    orderItems: Joi.array().required(),
    shippingAddress: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    phone: Joi.string()
      .ruleset.pattern(
        new RegExp(/^[0-9]{11}$/),
        "Mobile must be a number and equal to 11 numbers"
      )
      .rule({
        message: `Mobile must be a number and equal to 11 numbers`,
      })
      .required(),
    totalPrice: Joi.number(),
    user: Joi.string(),
  });
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const { orderItems, shippingAddress, city, zip, phone, user } = req.body;
  try {
    const orderItemsIds = Promise.all(
      orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          size: orderItem.size,
          color: orderItem.color,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
        const { countInStock } = await Product.findById(newOrderItem.product);
        await Product.findByIdAndUpdate(
          newOrderItem.product,
          { countInStock: countInStock - newOrderItem.quantity },
          { new: true }
        );
        return newOrderItem._id;
      })
    );

    const orderItemIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(
      orderItemIdsResolved.map(async (orderItemID) => {
        const orderItem = await OrderItem.findById(orderItemID).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    const order = new Order({
      orderItems: orderItemIdsResolved,
      shippingAddress,
      city,
      zip,
      phone,
      totalPrice: totalPrice,
      user,
    });

    await order.save();

    return res.status(201).json({
      message: "Order placed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/order/show-orders
//Only for logged In users
exports.showOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .sort({ updatedAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/order/show-order/:id
//Only for logged In users
exports.showOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const orders = await Order.findById(id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/order/update-order/:id
//Only for admin users
exports.updateOrderStatus = async (req, res) => {
  const orderSchema = Joi.object({
    status: Joi.string().required(),
  });
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const { status } = req.body;
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      return res.status(200).json(order);
    } else {
      return res.status(404).json({
        message: "Order not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/order/delete-order/:id
//Only for admin users
exports.deleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (order) {
      await order.orderItems.map(async (orderItem) => {
        await OrderItem.findByIdAndRemove(orderItem);
      });
      return res
        .status(200)
        .json({ success: true, message: "The order is deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "order not found!" });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/order/total-sales
//Only for admin users
exports.totalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }
  res.send({ totalsales: totalSales.pop().totalsales });
};

//api/order/count-order
//only for admin users
exports.countOrder = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    return res.status(200).send({ count: orderCount });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/order/user-order/:userid
//only for admin users
exports.userOrders = async (req, res) => {
  const userId = req.params.userid;
  try {
    const orders = await Order.find({ user: userId })
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      })
      .sort({ updatedAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
