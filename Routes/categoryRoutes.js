const express = require("express");
const router = express.Router();
const controller = require("../Controllers/categoryController");
const { auth } = require("../Middleware/auth");

router.post("/add-category", auth, controller.addCategory);
router.delete("/delete-category/:id", auth, controller.deleteCategory);
router.put("/update-category/:id", auth, controller.updateCategory);
router.get("/show-categories", controller.showCategories);
router.get("/show-category/:id", controller.showCategory);

module.exports = router;
