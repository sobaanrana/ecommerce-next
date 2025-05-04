const express = require("express");
const {
  registerUser,
  loginUser,
  verifyEmail,
} = require("../controllers/AuthController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);

module.exports = router;
