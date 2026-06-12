// Imports Bill model
const Bill = require("../models/Bill");

// GET /Bills 
// Request Body Example:
//              { 
//                  "household_id": 1 
//              }
async function index(req, res) {
    try {
        // Gets all Bills from model with getAll() from models
        const Bills = await Bill.getAll();
        // Sends success response
        res.status(200).json(Bills);
    } catch (err) {
        // Sends server error response
        res.status(500).json({ error: err.message });
    }
}

// GET /Bills 
// Request Body Example:
//              { 
//                  "account_id":  1 
//              }
async function show(req, res) {
    try {
        // Gets route parameter
        const name = req.params.name;
        // Finds country with getOneCountryByName() from models
        const country = await Bill.getOneByCountryName(name);
        // Sends success response
        res.status(200).json(country);
    } catch (err) {
        // Sends not found response
        res.status(404).json({ error: err.message });
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
async function create(req, res) {
    try {
        // Gets request body
        const data = req.body;
        // Creates country with create() from models
        const newCountry = await Bill.create(data);
        // Sends created response
        res.status(201).json(newCountry);
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
async function update(req, res) {
    try {
        const name = req.params.name;
        const data = req.body;
        // Finds existing country with getOneCountryByName() from models
        const country = await Bill.getOneByCountryName(name);
        // Updates country with update() from models
        const result = await country.update(data);
        // Sends updated response
        res.status(200).json(result);
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
async function update(req, res) {
    try {
        const name = req.params.name;
        const data = req.body;
        // Finds existing country with getOneCountryByName() from models
        const country = await Bill.getOneByCountryName(name);
        // Updates country with update() from models
        const result = await country.update(data);
        // Sends updated response
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

// DELETE /Bills
// Request Body Example:
//              {
//                  "bill_id": 1
//              }
async function destroy(req, res) {
    try {
        const name = req.params.name;
        // Finds existing country with getOneCountryByName() from models
        const country = await Bill.getOneByCountryName(name);
        // Deletes country with destroy() from models
        await country.destroy();
        // Sends success response with no body
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

// Exports controller functions
module.exports = { index, show, create, update, destroy };