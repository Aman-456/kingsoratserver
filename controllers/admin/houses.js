const Houses = require("../../models/House");

// Houses

// Update time information
exports.updateTimeAndActive = async (req, res) => {
  try {
    const { startDate, endDate, active } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ type: "failure", result: "Incomplete data provided" });
    }

    let housesDocument = await Houses.findOne({});

    if (!housesDocument) {
      housesDocument = new Houses({
        startDate,
        endDate,
        active: true,
      });
    } else {
      housesDocument.startDate = startDate;
      housesDocument.endDate = endDate;
      housesDocument.active = active || false;
    }

    await housesDocument.save();

    return res.json({
      type: "success",
      result: housesDocument,
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

// Create or update houses information
exports.createHouses = async (req, res) => {
  try {
    const { houses, startDate, endDate, active } = req.body;

    console.log(houses, startDate, endDate, active);

    if (!houses || !startDate || !endDate) {
      return res
        .status(400)
        .json({ type: "failure", result: "Incomplete data provided" });
    }

    let housesDocument = await Houses.findOne({});

    if (!housesDocument) {
      housesDocument = new Houses({
        houses,
        startDate,
        endDate,
        active,
      });
    } else {
      housesDocument.houses.push(...houses);
      housesDocument.startDate = startDate;
      housesDocument.endDate = endDate;
      housesDocument.active = active;
    }

    await housesDocument.save();

    return res.json({
      type: "success",
      result: housesDocument,
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

// Update single house details
exports.updateHouseDetails = async (req, res) => {
  try {
    const { houseId, HouseName } = req.body;

    if (!houseId || !HouseName) {
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

    houseToUpdate.HouseName = HouseName;
    // Recalculate TotalBetAmount based on the sum of bet amounts of all users
    houseToUpdate.TotalBetAmount = houseToUpdate?.users?.reduce(
      (total, user) => total + user.betAmount,
      0
    );
    // houseToUpdate.TotalBetAmount = TotalBetAmount;

    await housesDocument.save();

    return res.json({
      type: "success",
      result: housesDocument,
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

// Update active status of a house
exports.updateHouseActiveStatus = async (req, res) => {
  try {
    const { houseId, isActive } = req.body;

    if (!houseId) {
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

    houseToUpdate.isActive = isActive;

    await housesDocument.save();

    return res.json({
      type: "success",
      result: housesDocument,
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
