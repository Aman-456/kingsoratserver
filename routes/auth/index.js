const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth");
const auth = require("../../middlewares/auth");
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

exports.routes = router;
