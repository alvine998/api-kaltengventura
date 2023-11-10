const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();
require('dotenv').config();

var corsOptions = {
    origin: "*"
};

console.log("Login")

global.__basedir = __dirname;
const path = require('path')
app.use(express.static(path.join(__dirname, 'static')))
console.log(__dirname+'static', 'lll');

app.use(bodyParser.json({ limit: '100mb' }));
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '100mb',
        parameterLimit: 500000,
    }),
);

app.use(cors(corsOptions));
const db = require("./api/models");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to API Kalteng Ventura V2" });
});
require('./api/routes')(app);

// express to access file statics
const dirname = path.resolve();
app.use("/resources/uploads/", express.static(path.join(dirname, "/resources/uploads/")));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
