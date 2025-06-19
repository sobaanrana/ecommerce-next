const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

const createOrder = async (req, res) => {
  const { user, guest, items, totalAmount } = req.body;

  try {
    // Create a new order
    const newOrder = new Order({
      user: user ? user._id : null,
      guest: guest ? true : false,
      items: items,
      totalAmount: totalAmount,
      paymentStatus: "pending", // Initial status
      orderStatus: "created", // Initial status
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: err.message });
  }
};

const getOrderByID = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the user is logged in
    // const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    let user = null;

    // // If token exists, verify it to get the logged-in user
    // if (token !== "undefined") {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   user = await User.findById(decoded.userId);

    //   if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    //   }
    // }

    // Fetch the order,
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // For guests, there may not be a user object
    if (user) {
      // For logged-in users, populate the user information
      await order.populate("user", "name email");
    }

    // Return the order along with user details (if logged in)
    res.status(200).json({
      order,
      // user: user ? { id: user._id, name: user.name, email: user.email } : null, // Only include user if logged in
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve order", error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve orders", error: err.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { user, guest, items, totalAmount, paymentStatus, orderStatus } =
    req.body;

  console.log("Update Order Request:", {
    id,
    user,
    guest,
    items,
    totalAmount,
    paymentStatus,
    orderStatus,
  });
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        user: user ? user._id : null,
        guest: guest ? true : false,
        items: items,
        totalAmount: totalAmount,
        paymentStatus: paymentStatus,
        orderStatus: orderStatus,
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update order", error: err.message });
    return;
  }
};

const checkOrderStatus = async (req, res) => {
  // const { sessionId } = req.headers;
  const sessionId = req.get("sessionId"); // Use req.get() to access custom headers

  if (!sessionId) {
    return res.status(400).json({ message: "sessionId not provided in query" });
  }

  try {
    // Fetch the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Stripe session retrieved:", session);

    // Check if the payment was successful
    if (session.payment_status === "paid") {
      // Fetch the order using client_reference_id (passed when creating the session)
      const orderId = session.client_reference_id;
      const customerDetails = session.customer_details;

      // Assuming you have a MongoDB Order model, update the order with the Stripe sessionId and payment status
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update the order with the payment status and session details
      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      order.stripeSessionId = session.id;

      // Save the updated order in the database
      await order.save();

      // return res.json({
      //   paymentStatus: "paid",
      //   orderStatus: "processing",
      //   order: order._id, // Return the order ID to confirm the update
      //   customer: customerDetails,
      // });

      return res.json({
        order: order,
        customer: customerDetails,
      });
    } else {
      return res.json({ payment_status: "failed" });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    return res
      .status(500)
      .json({ message: "Error checking payment status", error: error.message });
  }
};

module.exports = router;
module.exports = {
  createOrder,
  getOrderByID,
  getAllOrders,
  updateOrder,
  checkOrderStatus,
};
