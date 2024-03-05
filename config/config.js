require("dotenv").config();

const development = {
    username: process.env.DB_LOCAL_USERNAME,
    password: process.env.DB_LOCAL_PASSWORD,
    database: process.env.DB_LOCAL_DATABASE,
    host: process.env.DB_LOCAL_HOST,
    dialect: "mysql",
};

const prod = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
};

module.exports = { development, prod };
