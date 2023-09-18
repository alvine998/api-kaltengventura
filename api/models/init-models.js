var DataTypes = require("sequelize").DataTypes;
var _applications = require("./applications");
var _banks = require("./banks");
var _debtors = require("./debtors");
var _images = require("./images");
var _payments = require("./payments");
var _users = require("./users");

function initModels(sequelize) {
  var applications = _applications(sequelize, DataTypes);
  var banks = _banks(sequelize, DataTypes);
  var debtors = _debtors(sequelize, DataTypes);
  var images = _images(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    applications,
    banks,
    debtors,
    images,
    payments,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
