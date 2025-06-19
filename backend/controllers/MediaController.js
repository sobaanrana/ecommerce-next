const cloudinary = require("cloudinary").v2; // Ensure cloudinary is required correctly
const Media = require("../models/Media");

exports.uploadProductImages = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming you are sending the userId from Postman as part of the body
    console.log("User ID:", userId);
    // Check if files are present in the request
    const images = req.files;
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload images to Cloudinary and save media entries
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image.path);

        // Create a new media entry in the database
        const newMedia = new Media({
          url: result.secure_url,
          type: result.format, // File format (e.g., jpg, png)
          size: result.bytes, // File size in bytes
          user: userId, // Associate the media with the user
        });

        await newMedia.save(); // Save the media entry

        return newMedia._id; // Return the ID of the uploaded image
      })
    );

    // Return success response with the uploaded image IDs
    res.status(201).json({
      message: "Images uploaded successfully",
      uploadedImages: uploadedImages,
    });
  } catch (err) {
    console.error("Error uploading images:", err);
    res
      .status(500)
      .json({ message: "Error inserting images", error: err.message });
  }
};
