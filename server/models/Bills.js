const db = require('../database/connect');

class Bills {

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

}