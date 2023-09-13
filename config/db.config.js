require('dotenv').config()

module.exports = {
    HOST: process.env.DB_HOST || "localhost",
    USER: "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    DB: "kaltengventura",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};