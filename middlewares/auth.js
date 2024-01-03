const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.verifyToken = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    token = token.split("Bearer ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded payload to the request for further use
    req.userId = decoded.userId;
    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ type: "failure", result: "Invalid token." });
  }
};
exports.verifyAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ _id: req.userId });
    if (!admin) {
      return res
        .status(401)
        .json({ type: "failure", result: "unauthorized no Admin" });
    }
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ type: "failure", result: "unauthorized." });
  }
};
