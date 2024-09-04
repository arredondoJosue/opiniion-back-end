require("dotenv").config();
const db = require("./dbConnect");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const { getUserLogs, getUserLogs2 } = require("./controller");
const SERVER_PORT = process.env.PORT || 4000;

// Connect to MongoDB then start the server
// db()
//   .then(() => {
//     app.listen(SERVER_PORT, () => {
//       console.log(`Server running on port ${SERVER_PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to MongoDB =>", error);
//     throw error;
//   });

app.use(cors());
app.use(express.json());

app.post("/user/logs", getUserLogs2);

mongoose
  .connect(process.env.MONGODB_URI, {
    maxPoolSize: 25,
    minPoolSize: 10,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB =>", error);
    throw error;
  });
