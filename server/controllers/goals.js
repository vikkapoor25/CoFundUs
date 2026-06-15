// Imports Goal model
const Goal = require("../models/Goal");

// GET /Goal/household/:household_id
async function getAllHouseholdGoalsController(req, res) {
    try {
        // Gets all goals from an household with getAllHouseholdBills() from models
        const goals = await Goal.getAllHouseholdGoals(req.params.household_id);
        // Sends success response
        res.status(200).json(goals);
    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: err.message });
    }
}

// POST /Goal
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
async function createGoalController(req, res) {
    try {
        // Creates goal with createGoal() from models
        const newGoal = await Goal.createGoal(req.body);
        // Sends created response
        res.status(201).json(newGoal);
    } catch (err) {
        // Sends bad request response
        res.status(400).json({ error: err.message });
    }
}

// PATCH /Goal
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
async function updateGoalController(req, res) {
    try {
        // Updates goal with updateGoal() from models
        const updateGoal = await Goal.updateGoal(req.body);
        // Sends updated response
        res.status(200).json(updateGoal);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

// DELETE /Goal
// Request Body Example:
//              {
//                  "goal_id": 1
//              }
async function deleteGoalController(req, res) {
    try {
        // Deletes goal with deleteGoal() from models
        await Goal.deleteGoal(req.body);
        // Sends success response with no body
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

// Exports controller functions
module.exports = {  
    getAllHouseholdGoalsController, 
    createGoalController, 
    updateGoalController, 
    deleteGoalController 
};