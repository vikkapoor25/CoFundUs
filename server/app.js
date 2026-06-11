const express = require("express");
const cors = require('cors');
const householdRouter = require("./routes/household");
const accountsRouter = require("./routes/accounts");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "",
        description: ""
    })
})

app.use("/user", householdRouter);
app.use("/bank-accounts", accountsRouter);

module.exports = app;
