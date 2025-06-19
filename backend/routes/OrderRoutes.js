const express = require("express");
const {
  createOrder,
  updateOrder,
  getOrderByID,
  checkOrderStatus,
} = require("../controllers/OrderControllers");

const router = express.Router();

router.post("/", createOrder);
router.get("/status", checkOrderStatus);
router.put("/:id", updateOrder);
router.get("/:id", getOrderByID);

module.exports = router;
