const Home = require("../models/Home");

async function getHomeSummaryController(req, res) {
  try {
    const summary = await Home.getHomeSummary(req.params.household_id);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUpcomingBillsController(req, res) {
  try {
    const bills = await Home.getUpcomingBills(req.params.household_id);
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getNetGainLossController(req, res) {
  try {
    const net = await Home.getNetGainLoss(req.params.household_id);
    res.status(200).json(net);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getClosestGoalController(req, res) {
  try {
    const goal = await Home.getClosestGoal(req.params.household_id);
    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getHomeSummaryController,
  getUpcomingBillsController,
  getNetGainLossController,
  getClosestGoalController,
};