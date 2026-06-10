const express = require('express');
const cors = require('cors');
const householdRouter = require('./routes/household');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "Discretion",
        description: "Send and receive private messages."
    })
})

app.use("/users", householdRouter);

module.exports = app;