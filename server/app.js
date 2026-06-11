const express = require("express");
const accountsController = require("./controllers/accounts");

const app = express();

app.use(express.json());

app.post("/bank-accounts/new", accountsController.createBankAccount);
app.delete("/bank-accounts/delete", accountsController.deleteBankAccount);

module.exports = app;