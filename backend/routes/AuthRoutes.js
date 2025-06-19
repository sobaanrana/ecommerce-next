const express = require("express");
const {
  registerUser,
  loginUser,
  verifyEmail,
  getLoggedInUser,
  logoutUser,
} = require("../controllers/AuthController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify/:token", verifyEmail);
router.get("/user", getLoggedInUser);

module.exports = router;
