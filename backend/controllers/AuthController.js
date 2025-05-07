const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/email");
const transporter = require("../utils/email");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // res
    //   .status(201)
    //   .json({ message: "User created successfully", user: newUser });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // const verifyLink = `${process.env.BASE_URL}/api/auth/verify/${token}`; used when user verified through email using backend url and then redirected to the frontedn from backend

    const verifyLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your Email",
      html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`,
    });

    // Send the verification email via Resend API
    // try {
    //   await sendVerificationEmail(email, verifyLink);
    //   return res
    //     .status(201)
    //     .json({ message: "User registered. Check email to verify." });
    // } catch (err) {
    //   return res
    //     .status(500)
    //     .json({ message: "Error sending verification email" });
    // }

    res
      .status(201)
      .json({ message: "User registered. Check email to verify." });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }

  // res.send("Hello from user api");
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Login Failed", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET); // verify token againt jwt secret key, decoded token payloa - return obj
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("User not found");

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });

    // res.redirect("http://localhost:3000/verified-success"); // frontend route
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
