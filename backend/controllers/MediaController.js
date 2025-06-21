const cloudinary = require("cloudinary").v2; // Ensure cloudinary is required correctly
const Media = require("../models/Media");
const streamifier = require("streamifier");

exports.uploadProductImages = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming you are sending the userId from Postman as part of the body
    console.log("User ID:", userId);

    // Check if files are present in the request
    const images = req.files;
    console.log("Uploaded files:", images); // Log the uploaded files

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload images to Cloudinary and save media entries
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        // // Upload to Cloudinary
        // const result = await cloudinary.uploader.upload(image.path); // Use image.path if using disk storage

        try {
          // Convert buffer to stream
          const stream = streamifier.createReadStream(image.buffer);

          // Upload to Cloudinary directly from buffer using a stream
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto", // Automatically detect file type (jpg, png, etc.)
                public_id: Date.now() + "-" + image.originalname, // Optional: Unique name
              },
              (error, result) => {
                if (error) {
                  reject(error); // Reject the promise if there's an error
                } else {
                  resolve(result); // Resolve the promise with the result if successful
                }
              }
            );

            // Pipe the stream
            stream.pipe(uploadStream);
          });

          // Create a new media entry in the database once upload is complete
          const newMedia = new Media({
            url: result.secure_url,
            type: result.format, // File format (e.g., jpg, png)
            size: result.bytes, // File size in bytes
            user: userId, // Associate the media with the user
          });

          await newMedia.save(); // Save the media entry

          return newMedia._id; // Return the ID of the uploaded image
        } catch (err) {
          console.error("Error uploading image to Cloudinary:", err);
          throw err; // Throw error to be caught by Promise.all
        }
      })
    );

    // Return success response with the uploaded image IDs
    res.status(201).json({
      message: "Images uploaded successfully",
      uploadedImages: uploadedImages,
    });
  } catch (err) {
    console.error("Error inserting images:", err);
    res.status(500).json({
      message: "Error inserting images",
      error: err.message,
    });
  }
};
