require('dotenv').config()

module.exports = {
    HOST: "103.27.206.137",
    USER: "user",
    PASSWORD: "KinikuMuda2023!",
    DB: "kaltengventura",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};