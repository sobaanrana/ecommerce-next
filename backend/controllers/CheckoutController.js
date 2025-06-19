const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout");
const Product = require("../models/Product");
const Media = require("../models/Media");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (req, res) => {
  const {
    user,
    guest,
    items,
    totalAmount,
    successUrl,
    cancelUrl,
    client_reference_id, // Pass the orderId here to link the order
  } = req.body;
  // const successUrl = "http://localhost:3000/success"; // Success page URL
  // const cancelUrl = "http://localhost:3000/cancel"; // Cancel page URL

  try {
    // Create an array of line items to pass to Stripe (products with prices)
    const lineItems = [];

    for (const item of items) {
      const productData = await Product.findById(item.productId);
      if (!productData) {
        return res.status(404).json({ message: "Product not found" });
      }

      lineItems.push({
        price_data: {
          currency: "usd", // Change this to the currency of your choice
          product_data: {
            name: productData.name,
            description: productData.description,
            images: await Promise.all(
              // Use Promise.all to handle async inside map
              productData.images.map(async (imageID) => {
                // Fetch image data from Media collection by ID
                const image = await Media.findById(imageID);

                // Ensure the image exists and has a URL
                return image ? image.url : null;
              })
            ),
          },
          unit_amount: productData.price * 100, // Price in cents (e.g., $30)
        },

        quantity: item.quantity, // Quantity of the item being purchased
      });

      console.log("Line items:", lineItems);
    }

    // const lineItems = [
    //   {
    //     price_data: {
    //       currency: "usd", // Change this to the currency of your choice
    //       product_data: {
    //         name: "adidas Mens Fab Polo Shirt",
    //         description:
    //           "Crafted with Climalite technology, a lightweight and breathable design, short sleeves for a comfortable fit.",
    //         images: [
    //           "https://res.cloudinary.com/rms0/image/upload/v1747683144/tlmoqyrvlmjuoqow156u.avif",
    //         ], // Array of product image URLs
    //       },
    //       unit_amount: 3000, // Price in cents (e.g., $30)
    //     },
    //     quantity: 1, // Quantity of the item being purchased
    //   },
    // ];

    // res.status(200).json({
    //   message: "Checkout data prepared successfully",
    //   lineItems,
    //   successUrl,
    //   cancelUrl,
    // });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: lineItems,
      mode: "payment", // Use 'payment' mode for one-time payments
      success_url: successUrl, // Success URL after successful payment
      cancel_url: cancelUrl, // Cancel URL if user cancels the payment
      client_reference_id: client_reference_id, // Pass the orderId here to link the order
    });

    res.json({ sessionId: session.id });

    // const newCheckout = new Checkout({
    //   user,
    //   guest,
    //   items,
    //   totalAmount,
    // });

    // await newCheckout.save();

    // res.status(201).json({
    //   message: "Checkout created successfully",
    //   checkout: newCheckout,
    // });
  } catch (err) {
    res.status(500).json({
      message: "Error creating Stripe Checkout session:",
      error: err.message,
    });
  }
};

const getCheckoutByID = async (req, res) => {
  const { id } = req.params;

  try {
    const checkout = await Checkout.findById(id).populate("user", "item");

    if (!checkout || checkout.length === 0) {
      return res.status(400).json({ message: "No Checkout found" });
    }

    res.status(200).json(checkout);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve checkout", error: err.message });
  }
};

module.exports = {
  createCheckout,
  getCheckoutByID,
};
