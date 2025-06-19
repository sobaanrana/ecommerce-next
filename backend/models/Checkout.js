const mongoose = require("mongoose");
const User = require("./User");
const { applyTimestamps } = require("./Product");

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make it optional for guests
    },
    guest: {
      type: Boolean,
      required: false, // This will be used for guests instead of user ID
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    successUrl: {
      type: String,
      required: true, // URL to redirect after successful payment
    },
    cancelUrl: {
      type: String,
      required: true, // URL to redirect if payment is cancelled
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
