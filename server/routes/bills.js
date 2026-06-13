const { Router } = require("express");
const billsController = require("../controllers/bills");

const billsRouter = Router();

// GET /Bills 
billsRouter.get("/:household_id", billsController.getAllHouseholdBillsController);

// GET /Bills 
billsRouter.get("/:account_id", billsController.getAllBankAccountBillsController);

// POST /Bills
// Request Body Example:
//              {
//                  "account_id": 1,
//                  "bill_name": "Netflix",
//                  "bill_amount": 15,
//                  "bill_due_date": "2026-07-01",
//                  "category": "Entertainment",
//                  "category_type": "Subscription",
//                  "repeat_bill": true,
//                  "payment_frequency": "Monthly",
//                  "bill_repeat_date": "2026-08-01"
//              }
// NOTE: Optional Columns -> bill_due_date, category_type, bill_repeat_date
//       Default Values:
//       - bill_due_date -> today's date
//       - category_type -> null
//       - bill_repeat_date -> null
// NOTE: paid is automatically assigned FALSE by the database
billsRouter.post("/new", billsController.createBillController);

// PATCH /Bills
// Request Body Example:
//              {
//                  "bill_id": 1,
//                  "bill_name": "Netflix Premium",
//                  "bill_amount": 20,
//                  "bill_due_date": "2026-07-15",
//                  "bill_repeat_date": "2026-08-15"
//              }
// NOTE: Optional Columns -> bill_due_date, bill_repeat_date
//       Default Values:
//       - bill_due_date -> today's date
//       - bill_repeat_date -> null
billsRouter.patch("/update", billsController.updateBillController);

// PATCH /Bills/Paid
// Request Body Example:
//              {
//                  "bill_id": 1
//              }
// NOTE: paid is automatically updated to TRUE
// Response Body Format:
//              {
//                  "paid": true
//              }
billsRouter.patch("/paid", billsController.billPaidController);

// DELETE /Bills
// Request Body Example:
//              {
//                  "bill_id": 1
//              }
billsRouter.delete("/delete", billsController.deleteBillController );

module.exports = billsRouter;