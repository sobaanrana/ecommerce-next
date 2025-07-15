const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      // type: String,
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      // enum: ["electronics", "clothing", "home", "beauty", "sports", "men"], // Modify categories as per your needs
    },
    images: [
      {
        //   type: [String], // Array of image URLs
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media", // Reference to the Media model
        required: true,
        validate: {
          validator: function (value) {
            return value.length >= 1 && value.length <= 4; // Ensure 1 to 4 images
          },
          message: "You can upload a maximum of 4 images.",
        },
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    productStatus: {
      type: String,
      required: true,
      default: "pending", // Default status when a product is created
      enum: ["pending", "approved", "denied"], // Modify statuses as per your needs
    },
    priceID: {
      // Stripe price ID for the product
      type: String,
      required: true,
    },
    stripeProductID: {
      // Stripe product ID for the product
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Product", productSchema);
