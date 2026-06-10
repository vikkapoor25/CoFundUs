const { Router } = require('express');

const householdController = require('../controllers/household.js');

const householdRouter = Router();

householdRouter.post("/register", householdController.register);
householdRouter.post("/login", householdController.login);

module.exports = householdRouter;