const { Router } = require("express");
const accountsController = require("../controllers/accounts");

const accountsRouter = Router();

accountsRouter.get("/:household_id", accountsController.getAccountsByHousehold);
accountsRouter.post("/new", accountsController.createBankAccount);
accountsRouter.delete("/delete", accountsController.deleteBankAccount);

module.exports = accountsRouter;