const GoalInsight = require("../models/GoalInsight")

// GET goal-insights/feasibility/household/:household_id
async function feasibility(req, res) {
    try {
        // Gets feasibility for each of a household's goals using getFeasibility() from models
        const feasibility = await GoalInsight.getFeasibility(req.params.household_id);

        // Sends success response (JSON Format With no Key)
        // res.status(200).json(feasibility);

        // Sends success response (JSON Format with Key Insight)
        // res.status(200).json({
        //     insight: feasibility
        // })

        // Sends success response (In Text Format for Viewing Backend)
        res.type("text/plain").send(feasibility)

    } catch (err) {
        // Sends server error response
        // console.error(err);
        res.status(500).json({ error: "Failed to generate feasibility insight." });
    }
}


// GET goal-insights/priority/household/:household_id
async function priority(req, res) {
    try {
        // Gets priority for each of a household's goals using getPriority() from models
        const priority = await GoalInsight.getPriority(req.params.household_id);

        // Sends success response (JSON Format With no Key)
        // res.status(200).json(priority);

                // Sends success response (JSON Format with Key Insight)
        // res.status(200).json({
        //     insight: priority
        // })

        // Sends success response (In Text Format for Viewing Backend)
        res.type("text/plain").send(priority)

    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: "Failed to generate priority insight." });
    }
}


// GET goal-insights/optimisation/household/:household_id
async function optimisation(req, res) {
    try {
        // Gets household's spending and identify actions to save money using getOptimisation() from models
        const optimisation = await GoalInsight.getOptimisation(req.params.household_id);

        // Sends success response (JSON Format With no Key)
        // res.status(200).json(optimisation);

                // Sends success response (JSON Format with Key Insight)
        // res.status(200).json({
        //     insight: optimisation
        // })

        // Sends success response (In Text Format for Viewing Backend)
        res.type("text/plain").send(optimisation)

    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: "Failed to generate optimisation insight." });
    }
}


// Exports controller functions
module.exports = { feasibility, priority, optimisation };