const express = require("express");
const router = express.Router();
const controller = require("../Controllers/cartController");
const { auth } = require("../Middleware/auth");

router.post("/add-cart", auth, controller.addCart);
router.delete("/delete-cart/:id", auth, controller.deleteCart);
router.get("/show-cart-data", auth, controller.showCartData);

module.exports = router;
