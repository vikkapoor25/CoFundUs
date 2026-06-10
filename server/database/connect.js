const { Pool } = require("pg");

const db = new Pool({
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = db;