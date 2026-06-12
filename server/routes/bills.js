const { Router } = require("express");
const billsController = require("../controllers/bills");

const billsRouter = Router();

// All require a request body
billsRouter.get("/household", billsController.getAllHouseholdBillsController); // Requires household_id in request body
billsRouter.get("/bank-account", billsController.getAllBankAccountBillsController); // Requires account_id in request body
billsRouter.post("/new", billsController.createBillController);
billsRouter.patch("/update", billsController.updateBillController);
billsRouter.patch("/paid", billsController.billPaidController);
billsRouter.delete("/delete", billsController.deleteBillController );

module.exports = billsRouter;