const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const connection = process.env.PGURL;

const db = new Client(connection);

module.exports = db;
