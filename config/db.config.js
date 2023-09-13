require('dotenv').config()

module.exports = {
    HOST: process.env.DB_HOST || "http:gojay.co.id:81",
    USER: "root",
    PASSWORD: process.env.DB_PASSWORD || "adminroot0987123",
    DB: "kaltengventura",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};