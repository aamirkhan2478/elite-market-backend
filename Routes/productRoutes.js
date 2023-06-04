const express = require("express");
const router = express.Router();
const controller = require("../Controllers/productController");
const { auth } = require("../Middleware/auth");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid file type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.post(
  "/add-product",
  auth,
  uploadOptions.single("image"),
  controller.addProduct
);
router.put(
  "/image-gallery/:id",
  auth,
  uploadOptions.array("images", 10),
  controller.imageGallery
);
router.put(
  "/update-product/:id",
  auth,
  uploadOptions.single("image"),
  controller.updateProduct
);
router.delete("/delete-product/:id", auth, controller.deleteProduct);
router.get("/show-products", controller.showProducts);
router.get("/show-product/:id", controller.showProduct);
router.get("/count-product", auth, controller.countProduct);
router.get("/featured-products/:count", controller.featuredProducts);

module.exports = router;
