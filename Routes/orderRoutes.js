const express = require("express");
const router = express.Router();
const controller = require("../Controllers/orderController");
const { auth } = require("../Middleware/auth");

router.post("/add-order", auth, controller.addOrder);
router.delete("/delete-order/:id", auth, controller.deleteOrder);
router.put("/update-order/:id", auth, controller.updateOrderStatus);
router.get("/show-orders", auth, controller.showOrders);
router.get("/show-order/:id", auth, controller.showOrder);
router.get("/total-sales", auth, controller.totalSales);
router.get("/count-order", auth, controller.countOrder);
router.get("/user-orders/:userid", auth, controller.userOrders);

module.exports = router;
