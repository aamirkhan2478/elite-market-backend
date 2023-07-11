const express = require("express");
const router = express.Router();
const controller = require("../Controllers/productController");
const { auth } = require("../Middleware/auth");

router.post("/add-product", auth, controller.addProduct);
router.put("/image-gallery/:id", auth, controller.imageGallery);
router.put("/update-product/:id", auth, controller.updateProduct);
router.delete("/delete-product/:id", auth, controller.deleteProduct);
router.get("/show-products", controller.showProducts);
router.get("/show-product/:id", controller.showProduct);
router.get("/count-product", auth, controller.countProduct);
router.get("/featured-products/:count", controller.featuredProducts);

module.exports = router;
