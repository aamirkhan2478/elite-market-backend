const express = require("express");
const router = express.Router();
const controller = require("../Controllers/cartController");
const { auth } = require("../Middleware/auth");

router.post("/add-cart", auth, controller.addCart);
router.delete("/delete-cart/:id", auth, controller.deleteCart);
router.get("/user-cart/:userid", auth, controller.userCart);

module.exports = router;
