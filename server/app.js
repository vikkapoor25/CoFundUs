const express = require("express");
const cors = require('cors');
const householdRouter = require("./routes/household");
const accountsRouter = require("./routes/accounts");
const billsRouter = require("./routes/bills");
const goalsRouter = require("./routes/goals");
const incomeRouter = require("./routes/income");
const goalInsightsRouter = require("./routes/goalInsights")
const homeRouter = require("./routes/home");

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
app.use("/bills", billsRouter);
app.use("/goals", goalsRouter);
app.use("/income", incomeRouter);
app.use("/goal-insights", goalInsightsRouter);

app.use("/home", homeRouter);
module.exports = app;
