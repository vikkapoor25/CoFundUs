const express = require("express");
const householdRouter = require('./routes/household');
const accountsController = require("./controllers/accounts");

const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        name: "",
        description: ""
    })
})

app.post("/bank-accounts/new", accountsController.createBankAccount);
app.delete("/bank-accounts/delete", accountsController.deleteBankAccount);

app.use("/users", householdRouter);

module.exports = app;