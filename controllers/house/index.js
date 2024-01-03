// Import necessary models
const Houses = require("../../models/House");
const User = require("../../models/User");

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
    } else {
      return res.json({
        type: "success",
        result: housesDocument,
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
    const { houseId, betAmount } = req.body;
    const userId = req.userId;
    if (!houseId || !userId) {
      return res
        .status(400)
        .json({ type: "failure", result: "Incomplete data provided" });
    }

    const [housesDocument, findUser] = await Promise.all([
      Houses.findOne({}),
      User.findOne({ _id: userId }),
    ]);

    if (!housesDocument) {
      return res
        .status(404)
        .json({ type: "failure", result: "Houses document not found" });
    }

    if (!findUser || findUser.userCoins < parseInt(betAmount)) {
      return res.status(404).json({
        type: "failure",
        result: "User not found or insufficient userCoins",
      });
    } else {
      findUser.userCoins -= betAmount;
      await findUser.save();
    }
    // Continue with the rest

    const houseToUpdate = housesDocument.houses.find(
      (house) => house._id.toString() === houseId
    );

    if (!houseToUpdate) {
      return res
        .status(404)
        .json({ type: "failure", result: "House not found" });
    }

    if (houseToUpdate && houseToUpdate.users) {
      const userIndex = houseToUpdate.users.findIndex(
        (user) => user.user == userId
      );

      if (userIndex === -1) {
        // User not found, add a new user
        houseToUpdate.users.push({
          user: userId,
          betAmount: parseInt(betAmount),
        });
      } else {
        const userToUpdate = houseToUpdate.users[userIndex];

        if (betAmount !== undefined && betAmount !== null && betAmount != 0) {
          // Update user's betAmount if provided
          userToUpdate.betAmount += parseInt(betAmount);
        } else {
          // Remove the user if betAmount is 0
          houseToUpdate.users = houseToUpdate.users.filter(
            ({ user }) => user != userId
          );
        }
      }
    }

    // Recalculate TotalBetAmount based on the sum of bet amounts of all users
    houseToUpdate.TotalBetAmount = parseInt(
      houseToUpdate.users.reduce(
        (total, user) => total + parseInt(user.betAmount),
        0
      )
    );
    console.log({ houseToUpdate });
    await housesDocument.save();
    const { password, createdAt, updatedAt, ...rest } = findUser;

    return res.json({
      type: "success",
      result: {
        houseDetails: housesDocument,
        user: rest,
      },
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
