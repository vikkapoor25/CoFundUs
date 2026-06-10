const { Router } = require('express');

const householdController = require('../controllers/household.js');

const householdRouter = Router();

householdRouter.post("/register", householdController.register);
householdRouter.post("/login", householdController.login);

// Import authentication middleware
const authenticator = require('../middleware/authenticator');
// Verify that the user is authenticated before granting access
householdRouter.get("/verify", authenticator, (req, res) => {
    res.status(200).json({
        authenticated: true
    });
});


module.exports = householdRouter;