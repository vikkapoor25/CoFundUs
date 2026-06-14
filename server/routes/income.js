const { Router } = require("express");
const incomeController = require("../controllers/income");

const incomeRouter = Router();

incomeRouter.get("/household/:household_id", incomeController.getAllHouseholdIncomeController);
incomeRouter.get("/bank-account/:account_id", incomeController.getAllBankAccountIncomeController);
incomeRouter.post("/new", incomeController.createIncomeController);
incomeRouter.patch("/update", incomeController.updateIncomeController);
incomeRouter.delete("/delete", incomeController.deleteIncomeController);

module.exports = incomeRouter;