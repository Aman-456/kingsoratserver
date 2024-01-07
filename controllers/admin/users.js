const User = require("../../models/User");

exports.listUsers = async (req, res) => {
  try {
    const users = await getList();
    return res.json({ type: "success", result: users });
  } catch (error) {
    res.status(500).json({ type: "failure", result: "Server Not Responding" });
  }
};
exports.togglestatus = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._id });
    user.hidden = user?.hidden ? false : true;
    await user.save();
    return res.json({ type: "success", result: "user's status updated " });
  } catch (error) {
    res.status(500).json({ type: "failure", result: "Server Not Responding" });
  }
};

const getList = async () => {
  try {
    const users = await User.find({})
      .select("-password -otp -expireTime")
      .sort({ createdAt: -1 });
    return users;
  } catch (e) {}
};
