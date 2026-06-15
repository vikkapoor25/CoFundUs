const { Router } = require("express");
const goalInsightsController = require("../controllers/goalInsights");

const goalInsightsRouter = Router();

// GET goal-insights/feasibility/household/:household_id
goalInsightsRouter.get("/feasibility/household/:household_id", goalInsightsController.feasibility);

// GET goal-insights/priority/household/:household_id
goalInsightsRouter.get("/priority/household/:household_id", goalInsightsController.priority);

// GET goal-insights/optimisation/household/:household_id
goalInsightsRouter.get("/optimisation/household/:household_id", goalInsightsController.optimisation);

module.exports = goalInsightsRouter;