const { Router } = require("express");
const accountsController = require("../controllers/accounts");

const accountsRouter = Router();

accountsRouter.post("/new", accountsController.createBankAccount);
accountsRouter.delete("/delete", accountsController.deleteBankAccount);

module.exports = accountsRouter;