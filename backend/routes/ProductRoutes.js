const express = require("express");
const {
  getProducts,
  createProduct,
  getProductByID,
  udpateProduct,
  deleteProduct,
  createProducts,
} = require("../controllers/ProductController");

const router = express.Router();

router.post("/create", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductByID);
router.put("/:id", udpateProduct);
router.delete("/:id", deleteProduct);
router.post("/create-products", createProducts);

module.exports = router;
