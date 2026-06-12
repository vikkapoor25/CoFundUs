require("dotenv").config();
const { Pool } = require("pg");

const isTest = process.env.NODE_ENV === "test";

const db = new Pool({
  connectionString: isTest
    ? process.env.DB_TEST_URL      // Supabase for integration testing
    : process.env.DB_URL,          // Amazon RDS standard DB

  ssl: isTest
    ? false                        // No SSL for Supabase
    : {
        rejectUnauthorized: false, // SSL for RDS
      },
});

module.exports = db;