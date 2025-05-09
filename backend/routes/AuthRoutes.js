const express = require("express");
const {
  registerUser,
  loginUser,
  verifyEmail,
  getLoggedInUser,
} = require("../controllers/AuthController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);
router.get("/user", getLoggedInUser);

module.exports = router;
