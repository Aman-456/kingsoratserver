const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/admin");
const { verifyAdmin, verifyToken } = require("../../middlewares/auth");

const {
  updateTimeAndActive,
  updateHouseDetails,
  updateHouseActiveStatus,
  createHouses,
} = require("../../controllers/admin");

const { check } = require("express-validator");

// create/update house
router.post("/time", verifyToken, verifyAdmin, updateTimeAndActive);
router.post("/updateouse", verifyToken, verifyAdmin, updateHouseDetails);
router.post("/createhouses", verifyToken, verifyAdmin, createHouses);
router.post("/updatestatus", verifyToken, verifyAdmin, updateHouseActiveStatus);
// list users

exports.routes = router;
