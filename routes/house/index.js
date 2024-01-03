const express = require("express");
const router = express.Router();
const { verifyAdmin, verifyToken } = require("../../middlewares/auth");

const {
  getTime,
  getHousesDetails,
  AddupdateUserBetInHouse,
} = require("../../controllers/house");

// Get current time information
router.get("/time", verifyToken, getTime);

// Get houses details
router.get("/getdetails", verifyToken, getHousesDetails);

// Add user to a house
router.post("/users", verifyToken, AddupdateUserBetInHouse);

exports.routes = router;
