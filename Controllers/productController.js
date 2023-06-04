const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");
const Joi = require("joi");
const mongoose = require("mongoose");
const { response } = require("express");

//api/product/add-product
//only for admin users
exports.addProduct = async (req, res) => {
  const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string(),
    images: Joi.array(),
    category: Joi.string().required(),
    brand: Joi.string(),
    colors: Joi.array(),
    countInStock: Joi.number().required(),
    isFeatured: Joi.boolean().required(),
  });
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const {
    name,
    price,
    description,
    images,
    category,
    brand,
    colors,
    countInStock,
    isFeatured,
  } = req.body;

  const file = req.file;
  if (!file) return res.status(400).json({ error: "File not found" });

  const fileName = req.file.filename;

  // https://domainname.com/public/uploads/filename-dfse3453ds.jpeg
  const basePath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/${fileName}`;
  try {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        error: "Category does not exist",
      });
    }
    const product = new Product({
      name,
      price,
      description,
      image: basePath,
      images,
      category,
      brand,
      colors,
      countInStock,
      isFeatured,
    });
    await product.save();
    return res.status(201).json({
      message: "Product added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/product/show-products
//api/product/show-products?category=categoryID
//api/product/show-products?search=name
//For all users
exports.showProducts = async (req, res) => {
  let filter = {};

  //Search products by category ID
  if (req.query.category) {
    filter = { category: req.query.category };
  }

  //Search products by name
  if (req.query.search) {
    filter = { name: { $regex: req.query.search, $options: "i" } };
  }

  // Pagination Logic
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const nextPage = page + 1;
  const previousPage = page - 1;

  try {
    const products = await Product.find(filter)
      .populate("category")
      .skip(skip)
      .limit(limit)
      .sort("price");
    return res.status(200).json({
      products,
      page,
      allData: products.length,
      nextPage,
      previousPage,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/product/show-product/:id
//For all users
exports.showProduct = async (req, res) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const product = await Product.findById(req.params.id).populate(
        "category"
      );
      return res.status(200).json(product);
    } else {
      return res.status(404).json({
        error: "Product not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/product/delete-product/:id
//only for admin users
exports.deleteProduct = async (req, res) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        message: "Product deleted successfully",
      });
    } else {
      return res.status(404).json({
        error: "Product not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/product/update-product/:id
//only for admin users
exports.updateProduct = async (req, res) => {
  const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string(),
    images: Joi.array(),
    category: Joi.string().required(),
    brand: Joi.string(),
    colors: Joi.array(),
    countInStock: Joi.number().required(),
    isFeatured: Joi.boolean().required(),
  });
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  const {
    name,
    price,
    description,
    category,
    brand,
    colors,
    countInStock,
    isFeatured,
  } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: "File not found" });

  const fileName = req.file.filename;

  // https://domainname.com/public/uploads/filename-dfse3453ds.jpeg
  const basePath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/${fileName}`;
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(400).json({
          error: "Product does not exist",
        });
      }
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = basePath;
      product.category = category;
      product.brand = brand;
      product.colors = colors;
      product.countInStock = countInStock;
      product.isFeatured = isFeatured;
      await product.save();
      return res.status(200).json({
        message: "Product updated successfully",
      });
    } else {
      return res.status(404).json({
        error: "Product not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/product/count-product
//only for admin users
exports.countProduct = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    return res.status(200).send({ count: productCount });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/product/featured-products
//For all users
exports.featuredProducts = async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);
    if (!products) {
      return res.status(404).json({
        error: "No products found",
      });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//api/product/image-gallery/:id
//only for admin users
exports.imageGallery = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const files = req.files;
  let imagesPaths = [];

  // https://domainname.com/public/uploads/filename-dfse3453ds.jpeg
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  try {
    await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    return res.status(200).json({ message: "Product images add successfully" });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
