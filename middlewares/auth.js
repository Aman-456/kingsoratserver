const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded payload to the request for further use
    req.userId = decoded;

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
