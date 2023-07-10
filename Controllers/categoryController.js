const Joi = require("joi");
const Category = require("../Models/categoryModel");
const { default: mongoose } = require("mongoose");

//api/category/add-category
//Only for admin users
exports.addCategory = async (req, res) => {
  const categorySchema = Joi.object({
    name: Joi.string().required(),
    icon: Joi.string(),
    color: Joi.string(),
  });
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const { name, icon, color } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: "File not found" });

  const fileName = req.file.filename;

  // https://domainname.com/public/uploads/filename-dfse3453ds.jpeg
  const basePath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/${fileName}`;
  try {
    const category = new Category({ name, icon, color, image: basePath });
    await category.save();
    return res.status(201).json({
      message: "Category added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/category/show-categories
//For all users
exports.showCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/category/show-category/:id
//For all users
exports.showCategory = async (req, res) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const category = await Category.findById(req.params.id);
      return res.status(200).json(category);
    } else {
      return res.status(404).json({
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/category/delete-category
//Only for admin users
exports.deleteCategory = async (req, res) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      await Category.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/category/update-category/:id
//Only for admin users
exports.updateCategory = async (req, res) => {
  const categorySchema = Joi.object({
    name: Joi.string(),
    icon: Joi.string(),
    color: Joi.string(),
  });
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const { name, icon, color } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: "File not found" });

  const fileName = req.file.filename;

  // https://domainname.com/public/uploads/filename-dfse3453ds.jpeg
  const basePath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/${fileName}`;

  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, icon, color, image: basePath },
        { new: true }
      );
      return res.status(200).json(category);
    } else {
      return res.status(404).json({
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
