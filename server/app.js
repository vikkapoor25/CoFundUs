const express = require("express");
const householdRouter = require("./routes/household");
const accountsRouter = require("./routes/accounts");

const app = express();

app.use(express.json());

app.use("/user", householdRouter);
app.use("/bank-accounts", accountsRouter);

module.exports = app;