const bodyParser = require("body-parser");
const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use(function (req, res, next) {
  console.log("api: " + req.originalUrl);
  next();
});

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes.routes);

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
