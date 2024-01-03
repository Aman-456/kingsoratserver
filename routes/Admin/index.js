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

router.post(
  "/signup",
  [
    check("username").notEmpty().withMessage("Username cannot be empty"),
    check("email").isEmail().withMessage("Invalid email format"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],

  AuthController.signup
);

router.get("/verify", AuthController.verifyUser);
router.post("/signin", AuthController.signin);
router.post("/verifyOTP", AuthController.verifyOTP);
router.post("/forgotPassword", AuthController.forgotPassword);
router.post("/changePassword", AuthController.changePassword);

// create/update house
router.post("/time", verifyToken, verifyAdmin, updateTimeAndActive);
router.post("/updateouse", verifyToken, verifyAdmin, updateHouseDetails);
router.post("/createhouses", verifyToken, verifyAdmin, createHouses);
router.post("/updatestatus", verifyToken, verifyAdmin, updateHouseActiveStatus);

exports.routes = router;
