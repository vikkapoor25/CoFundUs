require("dotenv").config();
const fs = require("fs");
const db = require("./connect");

const sql = fs.readFileSync("./server/database/setup.sql").toString();

db.query(sql)
  .then(() => {
    console.log("Database setup complete.");
    db.end();
  })
  .catch((error) => {
    console.error("Error running database setup:", error);
    db.end();
  });