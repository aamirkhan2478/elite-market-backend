const express = require("express");
const router = express.Router();
const controller = require("../Controllers/userController");
const { auth } = require("../Middleware/auth");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/get-user", auth, controller.getUser);
router.put("/update-user/:id", auth, controller.updateUser);

module.exports = router;
