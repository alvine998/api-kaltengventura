module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "adminroot0987123",
    DB: "kaltengventura",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};