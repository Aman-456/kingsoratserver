const auth = require("./auth");
const users = require("./users");
const houses = require("./houses");

module.exports = {
  ...auth,
  ...users,
  ...houses,
};
