const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "Discretion",
        description: "Send and receive private messages."
    })
})

app.use("/users", userRouter);

module.exports = app;