const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Create a product
const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    images,
    stock,
    seller,
    productStatus,
    priceID,
    stripeProductID,
  } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images,
      stock,
      seller,
      productStatus,
      priceID,
      stripeProductID,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: err.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 products per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const category = req.query.category; // Optional category filter

    // Get the total count of products (for pagination information)
    const totalProducts = await Product.countDocuments();

    // Fetch products with pagination
    const products = await Product.find(category ? { category } : {})
      .populate("images", "url") // Populate only necessary fields like URL
      .skip(skip)
      .limit(limit);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Format the images to return only URLs
    // const formattedImages = products.map((product) =>
    //   product.images.map((image) => image.url)
    // );
    // const formattedProducts = products.map((product, index) => ({
    //   ...product.toObject(),
    //   images: formattedImages[index],
    // }));
    res.status(200).json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products: products,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

// Get a product by ID
const getProductByID = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId).populate("images", "url"); // Populate only necessary fields like URL
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: err.message });
  }
};

// Update a product
const udpateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, category, image, stock } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, category, image, stock },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: err.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
};

// Create multiple products
const createProducts = async (req, res) => {
  const productsData = req.body; // An array of product objects

  try {
    // Use the `insertMany` method to insert multiple documents at once
    const createdProducts = await Product.insertMany(productsData);

    res.status(201).json({
      message: `${createdProducts.length} products created successfully.`,
      products: createdProducts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create products",
      error: err.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductByID,
  udpateProduct,
  deleteProduct,
  createProducts,
};
