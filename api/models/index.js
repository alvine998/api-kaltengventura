const dbConfig = require("../../config/db.config.js");
const mysql2 = require("mysql2");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: 3306,
  operatorsAliases: false,
  dialectModule: mysql2,
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
db.applications = require("./applications.js")(sequelize, Sequelize);
db.banks = require("./banks.js")(sequelize, Sequelize);
db.debtors = require("./debtors.js")(sequelize, Sequelize);
db.payments = require("./payments.js")(sequelize, Sequelize);
db.images = require("./images.js")(sequelize, Sequelize);
// db.categories = require("./categories.js")(sequelize, Sequelize);

module.exports = db;
