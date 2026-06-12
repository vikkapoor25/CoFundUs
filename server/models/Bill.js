const db = require('../database/connect');

class Bill {

    constructor({ household_id, bill_id, account_id, bill_amount, bill_due_date, category, category_type, repeat_bill, payment_frequency, bill_repeat_date, paid, }) {
        this.household_id = household_id;
        this.bill_id = bill_id;
        this.account_id = account_id;
        this.bill_amount = bill_amount;
        this.bill_due_date = bill_due_date;
        this.category = category;
        this.category_type = category_type;
        this.repeat_bill = repeat_bill;
        this.payment_frequency = payment_frequency;
        this.bill_repeat_date = bill_repeat_date;
        this.paid = paid;
    }

    // Gets all bills for a household
    static async getAllHouseholdBills(household_id) {
        // Runs SQL query: Gets all bills for a household by household_id
        const response = await db.query(`
            SELECT  a.household_id,
                    b.account_id,
                    b.bill_id,
                    b.bill_amount,
                    b.bill_due_date,
                    b.category,
                    b.category_type,
                    b.repeat_bill,
                    b.payment_frequency,
                    b.bill_repeat_date,
                    b.paid
            FROM bills b
            INNER JOIN accounts a
            ON (b.account_id = a.account_id)
            WHERE a.household_id = $1;`, [household_id]
        );
        // Throws error household has no bills
        if (response.rows.length === 0) {
            throw new Error("Household currently has no bills.");
        }
        // Converts database rows into Bill objects
        return response.rows.map(row => new Bill(row));
    }

    // Gets all bills for a bank account
    static async getAllBankAccountBills(account_id) {
        // Runs SQL query: Gets all bills for a bank account by account_id
        const response = await db.query(`
            SELECT  b.account_id,
                    b.bill_id,
                    b.bill_amount,
                    b.bill_due_date,
                    b.category,
                    b.category_type,
                    b.repeat_bill,
                    b.payment_frequency,
                    b.bill_repeat_date,
                    b.paid
            FROM bills b
            WHERE b.account_id = $1;`, [account_id]
        );
        // Throws error if bank account has no bills
        if (response.rows.length === 0) {
            throw new Error("Bank account currently has no bills.");
        }
        // Converts database rows into Bill objects
        return response.rows.map(row => new Bill(row));
    }

    // Creates a new bill
    static async createBill(data) {
        // Destructures request body
        const { account_id, bill_name, bill_amount, bill_due_date, category, category_type, repeat_bill, payment_frequency, bill_repeat_date, paid } = data
        // Checks if bank account exists befoe adding bill
        const existingBankAccount = await db.query("SELECT * FROM accounts WHERE account_id = $1", [account_id]);
        if (existingBankAccount.rows.length === 1) {
            // Creates bill for the bank account using account_id
            const response = await db.query(`
                INSERT INTO bills (account_id, bill_name, bill_amount, bill_due_date, category, category_type, repeat_bill, payment_frequency, bill_repeat_date, paid) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *;`, 
                [account_id, bill_name, bill_amount, bill_due_date, category, category_type, repeat_bill, payment_frequency, bill_repeat_date, paid]);
            // Returns created bill
            return new Bill(response.rows[0]);
        } else {
            throw new Error("Unable to create bill for account.");
        }
    }

    // Updates a Bill
    async updateBill(bill_id) {
        // Updates capital using SQL UPDATE
        const response = await db.query(`UPDATE bills
            SET account_id = $1,
                bill_amount = $2,
                bill_due_date = $3,
                category = $4,
                category_type = $5,
                repeat_bill = $6,
                payment_frequency = $7,
                bill_repeat_date = $8,
                paid = $9
            WHERE bill_id = $10
            RETURNING *;`, [this.account_id, this.bill_amount, this.bill_due_date, this.category, this.category_type, this.repeat_bill, this.payment_frequency, this.bill_repeat_date, this.paid, bill_id.bill_id ]);
        if (response.rows.length !== 1) {
            throw new Error("Unable to update bill.");
        }
        return new Bill(response.rows[0]);
    }

    // Deletes a Bill
    async deleteBill() {
        // Deletes country from database
        const response = await db.query("DELETE FROM country WHERE name = $1 RETURNING *;", [this.name]);
        if (response.rows.length !== 1) {
            throw new Error("Unable to delete country.");
        }
        return new Country(response.rows[0]);
    }

}