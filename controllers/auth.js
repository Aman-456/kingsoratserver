const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const {
  generateAccessToken,
  generateRefreshToken,
  readHTMLFileForMail,
  trimStringFields,
} = require("../common/utils");
const { KEYS, URL } = require("../common/constants");
const otpGenerator = require("otp-generator");
const path = require("path");

exports.signup = async (req, res, next) => {
  try {
    // Check if the username or email already exists
    const errors = validationResult(req);
    const trimmedData = trimStringFields(req.body);
    const { username, email, password } = trimmedData;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ type: "failure", result: errors.array()?.[0]?.msg });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.username === username ? "username" : "email";
      throw new Error(
        `${field} already exists. Please choose another ${field}.`
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();
    const LINK = `${URL}/api/auth/verify?username=${newUser.username}&id=${newUser._id}`;
    const replacements = {
      name: newUser.username,
      link: LINK,
    };
    await readHTMLFileForMail({
      replacements,
      subject: "Verify your email!",
      success: "User Registered Successfully",
      path: KEYS.EMAIL_VERIFICATION,
      email,
      res,
    });
  } catch (error) {
    // Handle specific errors
    return res.status(400).json({
      type: "failure",
      result: error?.message || "Couldn't create user",
    });
  }
};
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res
        .status(401)
        .json({ type: false, result: "Invalid credentials" });
    }

    if (!user?.verify) {
      return res
        .status(401)
        .json({ type: false, result: "Verify Your email first" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ type: false, result: "Invalid credentials" });
    }

    // Generate access token and refresh token
    const accessToken = generateAccessToken(user._id, req.body.type);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({ type: true, accessToken, refreshToken });
  } catch (error) {
    // Handle generic errors
    return res.status(400).json({
      type: "failure",
      result: error?.message || "Couldn't signin ",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    const now = new Date();
    const expiration_time = new Date(now.getTime() + 10 * 60000);

    let user = await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { otp, expireTime: expiration_time } },
      { new: true }
    );

    const replacements = {
      name: user.username,
      otp: otp,
    };

    await readHTMLFileForMail({
      replacements,
      subject: "OTP: For Change Password!",
      success: "OTP has been sent",
      path: KEYS.SEND_OTP,
      email: user.email,
      res,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, result: "Failed to send OTP." });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const data = await User.findOne({ email: req.body.email });

    const now = new Date();
    if (now > new Date(data.expireTime)) {
      res.status(401).json({ type: "failure", result: "OTP has been expired" });
    } else {
      if (otp === data.otp) {
        res
          .status(200)
          .json({ type: "success", result: "OTP has been verified" });
      } else {
        res.status(401).json({ type: "failure", result: "OTP is incorrect" });
      }
    }
  } catch (error) {
    console.log(error + "error");
    res.status(500).json({ type: "failure", result: "Server Not Responding" });
  }
};
exports.verifyUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { verify: true } },
      { new: true }
    );
    await res.sendFile(path.join(__dirname + "../." + KEYS.EMAIL_VERIFIED));
  } catch (error) {
    console.log(error + "error");
    res.status(500).json({ type: "failure", result: "Server Not Responding" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    console.log("OTP" + req.body.email + req.body.password);
    const { password } = req.body;

    const user = await User.findOne({ email: req.body.email });
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user
      .save()
      .then(() => {
        res.status(200).json({
          type: "success",
          result: "Password has been changed",
        });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ type: "failure", result: "Server Not Responding" });
        return;
      });
  } catch (error) {
    res.status(500).json({ type: "failure", result: "Server Not Responding" });
  }
};
