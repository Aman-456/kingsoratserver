const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/admin");
const { verifyAdmin, verifyToken } = require("../../middlewares/auth");

router.get("/listusers", verifyToken, verifyAdmin, AuthController.listUsers);
router.post(
  "/togglestatus",
  verifyToken,
  verifyAdmin,
  AuthController.togglestatus
);

exports.routes = router;
