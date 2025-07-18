export const sendEmailToBackend = async (receiptEmailHtml: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/send-receipt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent: receiptEmailHtml,
          to: "sobaancodes@gmail.com", // Recipient's email address
        }),
      }
    );

    if (response.ok) {
      console.log("Receipt email sent successfully!");
    } else {
      console.error("Failed to send receipt email.");
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
