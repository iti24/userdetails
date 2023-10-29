const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const config = require("./config");
const authRoutes = require("./routes/user");

// const { S3Client } = require("@aws-sdk/client-s3"); // Import AWS SDK v3 modules

mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB connection error"));

app.use(cors());
app.use(bodyParser.json());

console.log(config.accessKeyId);

// Initialize the S3 client
// const s3 = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: config.accessKeyId,
//     secretAccessKey: config.secretAccessKey,
//   },
// });

app.get("/", async (req, res) => {
  res.send("the server is running");
});

app.use("/api/auth", authRoutes);

app.listen(config.port, () => {
  console.log(`server started on port ${config.port}`);
});
