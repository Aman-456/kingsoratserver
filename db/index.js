// db.js
const mongoose = require("mongoose");

const { KEYS } = require("../common/constants");

const connectDB = async () => {
  const HOST = KEYS.HOST;
  const LOCAL = KEYS.DATABASE_URL_LOCAL;
  const PROD = KEYS.DATABASE_URL_PROD;
  const db = HOST === "LOCAL" ? LOCAL : PROD;
  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
