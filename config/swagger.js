const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Kalteng Ventura",
      version: "1.0.0",
      description: "API Documentation for Kalteng Ventura Application",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Local server",
      },
    ],
  },
  apis: ["./api/routes/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);
module.exports = specs;
