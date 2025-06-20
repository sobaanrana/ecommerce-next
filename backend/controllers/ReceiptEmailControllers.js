const transporter = require("../utils/email");

const sendReceiptEmail = async (req, res) => {
  const { emailContent, to } = req.body;

  console.log("Received email content:", emailContent);
  console.log("Sending email to:", to);
  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email address
    to: to, // Recipient email address
    subject: "Your Order Receipt", // Subject of the email
    html: emailContent, // HTML content of the email
  };

  try {
    // Send the email using the transporter object
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Receipt email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Failed to send email", error });
  }
};

module.exports = sendReceiptEmail;
