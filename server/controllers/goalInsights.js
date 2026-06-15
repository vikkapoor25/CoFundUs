const GoalInsight = require("../models/GoalInsight")

// GET goal-insights/feasibility/:household_id
async function feasibility(req, res) {
    try {
        // Gets feasibility for each of a household's goals using getFeasibility() from models
        const feasibility = await GoalInsight.getFeasibility(req.params.household_id);
        // Sends success response
        res.status(200).json(feasibility);
    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: "Failed to generate feasibility insight." });
    }
}


// GET goal-insights/priority/:household_id
async function priority(req, res) {
    try {
        // Gets priority for each of a household's goals using getPriority() from models
        const priority = await GoalInsight.getPriority(req.params.household_id);
        // Sends success response
        res.status(200).json(priority);
    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: "Failed to generate priority insight." });
    }
}


// GET goal-insights/optimisation/:household_id
async function optimisation(req, res) {
    try {
        // Gets household's spending and identify actions to save money using getOptimisation() from models
        const optimisation = await GoalInsight.getFeasibility(req.params.household_id);
        // Sends success response
        res.status(200).json(optimisation);
    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: "Failed to generate optimisation insight." });
    }
}


// Exports controller functions
module.exports = { feasibility, priority, optimisation };