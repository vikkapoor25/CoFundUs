// Imports Bill model
const Bill = require("../models/Bill");

// GET /Bills/household/:household_id 
async function getAllHouseholdBillsController(req, res) {
    try {
        // Gets all Bills from a household with getAllHouseholdBills() from models
        const bills = await Bill.getAllHouseholdBills(req.params.household_id);
        // Sends success response
        res.status(200).json(bills);
    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: err.message });
    }
}

// GET /Bills/bank-account/:account_id
async function getAllBankAccountBillsController(req, res) {
    try {
        // Gets all Bills from an account with getAllBankAccountBills() from models
        const bills = await Bill.getAllBankAccountBills(req.params.account_id);
        // Sends success response
        res.status(200).json(bills);
    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: err.message });
    }
}

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
async function createBillController(req, res) {
    try {
        // Creates bill with createBill() from models
        const newBill = await Bill.createBill(req.body);
        // Sends created response
        res.status(201).json(newBill);
    } catch (err) {
        // Sends bad request response
        res.status(400).json({ error: err.message });
    }
}

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
async function updateBillController(req, res) {
    try {
        // Updates bill with updateBill() from models
        const updateBill = await Bill.updateBill(req.body);
        // Sends updated response
        res.status(200).json(updateBill);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

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
async function billPaidController(req, res) {
    try {
        // Updates paid in specific bill as true with billPaid() from models
        const updateBillPaid = await Bill.billPaid(req.body);
        // Sends updated response
        res.status(200).json(updateBillPaid);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

// DELETE /Bills
// Request Body Example:
//              {
//                  "bill_id": 1
//              }
async function deleteBillController(req, res) {
    try {
        // Deletes bill with deleteBill from models
        const deleteBill = await Bill.deleteBill(req.body);
        // Sends success response with no body
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

// Exports controller functions
module.exports = { 
    getAllHouseholdBillsController, 
    getAllBankAccountBillsController, 
    createBillController, 
    updateBillController, 
    billPaidController, 
    deleteBillController 
};