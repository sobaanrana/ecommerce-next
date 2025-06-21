const express = require("express");
const upload = require("../utils/multer");

const { uploadProductImages } = require("../controllers/MediaController");

const router = express.Router();

router.post("/upload", upload.array("images", 4), uploadProductImages);
// router.post("/upload", uploadProductImages);

module.exports = router;
