require('dotenv').config()

module.exports = {
    HOST: "103.163.138.104",
    USER: "bisaprin_alvin",
    PASSWORD: "alvine1234!",
    DB: "bisaprin_kaltengventura",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
