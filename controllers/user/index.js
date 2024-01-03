const User = require("../../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    const { password, createdAt, updatedAt, ...rest } = user;
    return res.json({
      type: "success",
      result: rest,
    });
  } catch (error) {
    res.status(500).json({ type: "failure", result: "Server Not Responding" });
  }
};
