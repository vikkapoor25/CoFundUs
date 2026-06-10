// Loads variables from .env into process.env
require("dotenv").config();

// Imports configured Express app
const app = require("./app");

// Uses environment PORT
const port = process.env.PORT;

// Starts server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});