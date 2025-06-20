const express = require("express");
const sendReceiptEmail = require("../controllers/ReceiptEmailControllers");

const router = express.Router();
// Endpoint to receive email content and send it
router.post("/", sendReceiptEmail);

module.exports = router;
