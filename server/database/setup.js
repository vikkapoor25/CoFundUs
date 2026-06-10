require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("./connect");

const sql = fs.readFileSync(path.join(__dirname, "setup.sql")).toString();

db.query(sql)
    .then(() => {
        console.log("Database setup complete.");
        db.end();
    })
    .catch((err) => {
        console.error("Error running database setup:", error);
        db.end();
    });