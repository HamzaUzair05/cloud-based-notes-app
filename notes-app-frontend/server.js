const express = require("express");
const path = require("path");
const AWS = require("aws-sdk");

const app = express();

// Setup AWS SDK with your region
const s3 = new AWS.S3({
  region: 'us-east-1' // Using your actual region (us-east-1 based on your RDS)
});

// Your private S3 bucket info - you'll need to create this
const BUCKET_NAME = "notes-app-images-bucket"; // Create this bucket in your AWS account
const IMAGE_KEY = "notes_image.jpg"; // Upload this image to your bucket

// Serve static files from the React build
app.use(express.static(path.join(__dirname, "build")));

// Handle the case where S3 isn't set up yet
app.get("/secure-image", async (req, res) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: IMAGE_KEY,
    };

    // Try to get the object from S3
    const data = await s3.getObject(params).promise();
    
    res.set("Content-Type", data.ContentType);
    res.send(data.Body);
  } catch (err) {
    console.error("S3 fetch error:", err);
    // Return a placeholder image if S3 access fails
    res.sendFile(path.join(__dirname, "public", "placeholder.jpg"));
  }
});

// Catch-all: serve React index.html for SPA routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`React app running on port ${PORT}`);
});
