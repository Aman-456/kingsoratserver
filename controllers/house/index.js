// Import necessary models
const Houses = require("../../models/House");

// Get current time information
exports.getTime = async (req, res) => {
  try {
    const housesDocument = await Houses.findOne({});
    if (!housesDocument) {
      // If no document exists, return default values
      return res.json({
        type: "success",
        result: { startDate: "", endDate: "", active: false },
      });
    }
    const { startDate, endDate, active } = housesDocument;
    return res.json({
      type: "success",
      result: { startDate, endDate, active },
    });
  } catch (error) {
    res.status(500).json({ type: "failure", result: "Server Not Responding" });
  }
};
exports.getHousesDetails = async (req, res) => {
  try {
    const housesDocument = await Houses.findOne({});
    if (!housesDocument) {
      // If no document exists, return default values
      return res.json({
        type: "success",
        result: {},
      });
    }
    // Recalculate TotalBetAmount based on the sum of bet amounts of all users
  } catch (error) {
    res.status(500).json({ type: "failure", result: "Server Not Responding" });
  }
};

// Add user to a house
// Update user's bet in a house or remove user if betAmount is 0 or not provided
exports.AddupdateUserBetInHouse = async (req, res) => {
  try {
    const { houseId, userId, betAmount } = req.body;

    if (!houseId || !userId) {
      return res
        .status(400)
        .json({ type: "failure", result: "Incomplete data provided" });
    }

    let housesDocument = await Houses.findOne({});

    if (!housesDocument) {
      return res
        .status(404)
        .json({ type: "failure", result: "Houses document not found" });
    }

    const houseToUpdate = housesDocument.houses.find(
      (house) => house._id.toString() === houseId
    );

    if (!houseToUpdate) {
      return res
        .status(404)
        .json({ type: "failure", result: "House not found" });
    }

    const userToUpdate = houseToUpdate?.users?.find(
      (user) => user._id.toString() === userId
    );

    if (!userToUpdate) {
      houseToUpdate?.users?.push({ _id: userId, betAmount });
    } else {
      if (betAmount !== undefined && betAmount !== null && betAmount !== 0) {
        // Update user's betAmount if provided
        userToUpdate.betAmount = betAmount;
      } else {
        // Remove the user if betAmount is 0
        houseToUpdate.users = houseToUpdate.users.filter(
          (user) => user._id.toString() !== userId
        );
      }
    }

    // Recalculate TotalBetAmount based on the sum of bet amounts of all users
    houseToUpdate.TotalBetAmount = houseToUpdate.users.reduce(
      (total, user) => total + user.betAmount,
      0
    );

    await housesDocument.save();

    return res.json({
      type: "success",
      result: houseToUpdate,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ type: "failure", result: "Invalid data provided" });
    }

    return res.status(500).json({ type: "failure", result: "Server Error" });
  }
};
