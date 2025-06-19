const express = require("express");
const { uploadProductImages } = require("../controllers/MediaController");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/upload", upload.array("images", 4), uploadProductImages);

module.exports = router;
