// utils/email.js
import { Resend } from "resend";

// Initialize the Resend client with your API key
const resendClient = new Resend(process.env.RESEND_API_KEY);

// Send email function using Resend's API
export const sendVerificationEmail = async (email, verifyLink) => {
  try {
    const response = await resendClient.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your Email",
      html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`,
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};
