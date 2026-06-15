const BankAccount = require("../models/accounts");

async function createBankAccount(req, res) {
  try {
    const newAccount = await BankAccount.create(req.body);
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteBankAccount(req, res) {
  try {
    const deletedAccount = await BankAccount.deleteById(req.body.account_id);

    if (!deletedAccount) {
      return res.status(404).json({ error: "Bank account not found" });
    }

    res.status(200).json({
      message: "Bank account deleted",
      deletedAccount,
    });
  } catch (err) {
    if (err.message.includes("violates foreign key constraint")) {
      return res.status(400).json({
        error: "This account cannot be deleted because it still has income or bills assigned to it.",
      });
    }

    res.status(500).json({ error: err.message });
  }
}

async function getAccountsByHousehold(req, res) {
  try {
    const accounts = await BankAccount.getByHouseholdId(req.params.household_id);
    res.status(200).json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createBankAccount,
  deleteBankAccount,
  getAccountsByHousehold,
};