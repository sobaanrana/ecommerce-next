const express = require("express");
const upload = require("../utils/multer");

const { uploadProductImages } = require("../controllers/MediaController");

const router = express.Router();

router.post("/upload", upload.array("images", 4), uploadProductImages);

module.exports = router;
