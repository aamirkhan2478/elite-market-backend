const express = require("express");
const router = express.Router();
const controller = require("../Controllers/categoryController");
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
  "/add-category",
  auth,
  uploadOptions.single("image"),
  controller.addCategory
);
router.delete("/delete-category/:id", auth, controller.deleteCategory);
router.put(
  "/update-category/:id",
  auth,
  uploadOptions.single("image"),
  controller.updateCategory
);
router.get("/show-categories", controller.showCategories);
router.get("/show-category/:id", controller.showCategory);

module.exports = router;
