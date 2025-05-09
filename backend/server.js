const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const bodyParser = require("body-parser");

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

const authRoutes = require("./routes/AuthRoutes");

app.use("/api/auth", authRoutes);

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
