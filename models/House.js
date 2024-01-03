const mongoose = require("mongoose");

const House = new mongoose.Schema(
  {
    HouseName: {
      type: String,
      required: true,
    },
    TotalBetAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    winner: {
      type: String,
      required: false,
    },
    users: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        betAmount: { type: Number, default: 0 },
      },
    ],
    isActive: {
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);
const housesSchema = new mongoose.Schema(
  {
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    houses: [House],
  },
  { timestamps: true }
);
const Houses = mongoose.model("Houses", housesSchema);

module.exports = Houses;
