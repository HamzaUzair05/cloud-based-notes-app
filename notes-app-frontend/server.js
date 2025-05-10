const express = require("express");
const path = require("path");
const AWS = require("aws-sdk");

const app = express();

// Setup AWS SDK (credentials automatically loaded from IAM role in EB)
const s3 = new AWS.S3();

// Your private S3 image info
const BUCKET_NAME = "elasticbeanstalk-eu-north-1-149536481855";
const IMAGE_KEY = "notes_image.jpg";

// Serve static files from the React build
app.use(express.static(path.join(__dirname, "build")));

// Secure route to fetch the private image from S3
app.get("/secure-image", async (req, res) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: IMAGE_KEY,
    };

    const data = await s3.getObject(params).promise();

    res.set("Content-Type", data.ContentType);
    res.send(data.Body);
  } catch (err) {
    console.error("S3 fetch error:", err);
    res.status(500).send("Failed to load image");
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
