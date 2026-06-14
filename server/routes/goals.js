const { Router } = require("express");
const goalsController = require("../controllers/goals");

const goalsRouter = Router();

// GET /Goal/household/:household_id
goalsRouter.get("/household/:household_id", goalsController.getAllHouseholdGoalsController);

// POST /Goal/new
// Request Body Example:
//              {
//                  "household_id": 1,
//                  "goal_name": "Purchase Phone",
//                  "goal_amount": 300,
//                  "current_value": 100,
//                  "target_date": "2026-07-14"
//              }
// NOTE: Optional Columns -> current_value, target_date
//       Default Values:
//       - current_value -> 0
//       - target_date -> null
goalsRouter.post("/new", goalsController.createGoalController);

// PATCH /Goal/update
// Request Body Example:
//              {
//                  "goal_id": 1,
//                  "goal_name": "Purchase iPhone",
//                  "goal_amount": 320,
//                  "current_value": 120,
//                  "target_date": "2026-08-14"
//              }
// NOTE: Optional Columns -> target_date
//       Default Values:
//       - target_date -> null
goalsRouter.patch("/update", goalsController.updateGoalController);

// DELETE /Goal/delete
// Request Body Example:
//              {
//                  "goal_id": 1
//              }
goalsRouter.delete("/delete", goalsController.deleteGoalController );

module.exports = goalsRouter;