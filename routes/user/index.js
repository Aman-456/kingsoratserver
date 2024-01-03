const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/user");
const auth = require("../../middlewares/auth");

router.get("/getuser", auth.verifyToken, UserController.getUser);

exports.routes = router;
