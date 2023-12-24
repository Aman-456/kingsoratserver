// db.js
require("dotenv").config();

const mongoose = require("mongoose");

const { KEYS } = require("../common/constants");

const connectDB = async () => {
  const HOST = process.env.HOST;
  const LOCAL = process.env.DATABASE_URL_LOCAL;
  const PROD = process.env.DATABASE_URL_PROD;
  const db = HOST === "LOCAL" ? LOCAL : PROD;
  console.log(db);
  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
