const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;

dotenv.config();

const app = express();

//Middleware
//
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from the frontend
    credentials: true, // Allow sending cookies if necessary
  })
);

app.use(express.json());
// app.use(bodyParser.json());

// Basic test route
// app.get("/", (res, req) => {
//   res.send("Ecomm API running");
// });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Initialize Stripe
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const authRoutes = require("./routes/AuthRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/ProductRoutes");
app.use("/api/products", productRoutes);

const mediaRoutes = require("./routes/MediaRoutes");
app.use("/api/media", mediaRoutes);

const checkoutRoutes = require("./routes/CheckoutRoutes");
app.use("/api/checkout", checkoutRoutes);

const orderRoutes = require("./routes/OrderRoutes");
app.use("/api/order", orderRoutes);

const receiptEmailRoutes = require("./routes/ReceiptEmailRoutes");
app.use("/api/send-receipt", receiptEmailRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: `Hello user ${req.user.userId}, role: ${req.user.role}`,
  });
});
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
