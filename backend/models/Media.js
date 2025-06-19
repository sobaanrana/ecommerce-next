const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true, // Store the URL of the image, could be a cloud storage link
    },
    type: {
      type: String,
      required: true, // Image type (e.g., "image/png", "image/jpeg")
    },
    size: {
      type: Number,
      required: true, // Image file size in bytes
    },
    createdAt: {
      type: Date,
      default: Date.now, // Store when the image was uploaded
    },
    // Additional fields can be added here if needed, e.g., metadata

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // Ensure that each image is associated with a user
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
