const express = require("express");
const Category = require("../models/Category");

const createCateogry = async (req, res) => {
  const { name, parent } = req.body;

  try {
    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const newCategory = new Category({
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), // Capitalize first letter
      parent: parent,
    });

    // Save the new category to the database
    await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating cateogry",
      error: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parent");

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        message: "No categories found",
      });
    }

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

const createCategories = async (req, res) => {
  const categoriesData = req.body;
  try {
    if (!categoriesData || categoriesData.length === 0) {
      return res.status(400).json({ message: "Categories are not provided" });
    }

    const updatedCategories = categoriesData?.map((category) => ({
      ...category,
      name:
        category.name.charAt(0).toUpperCase() +
        category.name.slice(1).toLowerCase(),
    }));

    const createdCategories = await Category.insertMany(updatedCategories);

    res.status(201).json({
      message: `${createdCategories.length} categories created successfully,`,
      categories: createdCategories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create categories",
      error: error.message,
    });
  }
};

module.exports = {
  createCateogry,
  getCategories,
  createCategories,
};
