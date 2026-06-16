const { Router } = require("express");
const homeController = require("../controllers/home");

const homeRouter = Router();

homeRouter.get("/bills/:household_id", homeController.getUpcomingBillsController);
homeRouter.get("/net/:household_id", homeController.getNetGainLossController);
homeRouter.get("/goal/:household_id", homeController.getClosestGoalController);
homeRouter.get("/:household_id", homeController.getHomeSummaryController);

module.exports = homeRouter;