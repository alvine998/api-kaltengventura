const dbConfig = require("../../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.js")(sequelize, Sequelize);
// db.customers = require("./customers.js")(sequelize, Sequelize);
// db.apps = require("./apps.js")(sequelize, Sequelize);
// db.prices = require("./prices.js")(sequelize, Sequelize);
// db.stocks = require("./stocks.js")(sequelize, Sequelize);
// db.transactions = require("./transactions.js")(sequelize, Sequelize);
// db.categories = require("./categories.js")(sequelize, Sequelize);

module.exports = db;