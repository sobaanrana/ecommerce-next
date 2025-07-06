const express = require("express");
const {
  createCateogry,
  getCategories,
  createCategories,
} = require("../controllers/CategoryController");
const router = express.Router();

router.post("/create", createCateogry);
router.get("/", getCategories);
router.post("/create-categories", createCategories);

module.exports = router;
