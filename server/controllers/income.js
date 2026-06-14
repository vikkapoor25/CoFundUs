const Income = require("../models/income");

async function getAllHouseholdIncomeController(req, res) {
  try {
    const income = await Income.getAllHouseholdIncome(req.params.household_id);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllBankAccountIncomeController(req, res) {
  try {
    const income = await Income.getAllBankAccountIncome(req.params.account_id);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createIncomeController(req, res) {
  try {
    const newIncome = await Income.createIncome(req.body);
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateIncomeController(req, res) {
  try {
    const updatedIncome = await Income.updateIncome(req.body);
    res.status(200).json(updatedIncome);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function deleteIncomeController(req, res) {
  try {
    await Income.deleteIncome(req.body);
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  getAllHouseholdIncomeController,
  getAllBankAccountIncomeController,
  createIncomeController,
  updateIncomeController,
  deleteIncomeController,
};