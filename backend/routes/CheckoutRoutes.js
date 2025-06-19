const express = require("express");
const {
  createCheckout,
  getCheckoutByID,
} = require("../controllers/CheckoutController");

const router = express.Router();

router.post("/", createCheckout);
router.get("/:id", getCheckoutByID);

module.exports = router;
