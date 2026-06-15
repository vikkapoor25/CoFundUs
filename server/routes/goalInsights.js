const { Router } = require("express");
const goalInsightsController = require("../controllers/goalInsights");

const goalInsightsRouter = Router();

// GET goal-insights/feasibility/:household_id
goalInsightsRouter.get("/household/:household_id", goalInsightsController.feasibility);

// GET goal-insights/priority/:household_id
goalInsightsRouter.get("/household/:household_id", goalInsightsController.priority);

// GET goal-insights/optimisation/:household_id
goalInsightsRouter.get("/household/:household_id", goalInsightsController.optimisation);

module.exports = goalInsightsRouter;