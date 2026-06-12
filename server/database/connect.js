require("dotenv").config();
const { Pool } = require("pg");

const isTest = process.env.NODE_ENV === "test";

const db = isTest
  ? new Pool({
      connectionString: process.env.DB_TEST_URL,
      ssl: false,
    })
  : new Pool({
      ssl: {
        rejectUnauthorized: false,
      },
    });

module.exports = db;