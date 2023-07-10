const express = require("express");
const router = express.Router();
const controller = require("../Controllers/userController");
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

router.post("/signup", uploadOptions.single("pic"), controller.signup);
router.post("/login", controller.login);
router.get("/get-user", auth, controller.getUser);
router.put(
  "/update-user/:id",
  auth,
  uploadOptions.single("pic"),
  controller.updateUser
);
router.delete("/delete-account/:id", auth, controller.deleteAccount);

module.exports = router;
