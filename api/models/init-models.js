var DataTypes = require("sequelize").DataTypes;
var _aspirations = require("./aspirations");
var _cities = require("./cities");
var _districts = require("./districts");
var _provinces = require("./provinces");
var _users = require("./users");
var _villages = require("./villages");
var _wilayah = require("./wilayah");

function initModels(sequelize) {
  var aspirations = _aspirations(sequelize, DataTypes);
  var cities = _cities(sequelize, DataTypes);
  var districts = _districts(sequelize, DataTypes);
  var provinces = _provinces(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var villages = _villages(sequelize, DataTypes);
  var wilayah = _wilayah(sequelize, DataTypes);


  return {
    aspirations,
    cities,
    districts,
    provinces,
    users,
    villages,
    wilayah,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
