const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
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
const HOST = process.env.HOST;
const LOCAL = process.env.DATABASE_URL_LOCAL;
const PROD = process.env.DATABASE_URL_PROD;
const db = HOST === "LOCAL" ? LOCAL : PROD;
mongoose
  .connect(db)
  .then((e) => {
    console.log("db connecetd");
  })
  .catch((e) => {
    console.log(e.message);
  });

// Routes
app.use("/api/auth", authRoutes.routes);

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
