const db = require("../database/connect");

class Income {
  constructor({
    household_id,
    income_id,
    account_id,
    income_amount,
    payment_date,
    category,
    repeat_income,
    payment_frequency,
    income_repeat_date,
  }) {
    this.household_id = household_id;
    this.income_id = income_id;
    this.account_id = account_id;
    this.income_amount = income_amount;
    this.payment_date = payment_date
      ? new Date(payment_date).toLocaleDateString("en-CA")
      : null;
    this.category = category;
    this.repeat_income = repeat_income;
    this.payment_frequency = payment_frequency;
    this.income_repeat_date = income_repeat_date
      ? new Date(income_repeat_date).toLocaleDateString("en-CA")
      : null;
  }

  static async getAllHouseholdIncome(household_id) {
    const response = await db.query(
      `SELECT
        a.household_id,
        i.income_id,
        i.account_id,
        i.income_amount,
        i.payment_date,
        i.category,
        i.repeat_income,
        i.payment_frequency,
        i.income_repeat_date
      FROM income i
      JOIN accounts a ON i.account_id = a.account_id
      WHERE a.household_id = $1
      ORDER BY i.income_id;`,
      [household_id]
    );

    if (response.rows.length === 0) {
      throw new Error("Household currently has no income.");
    }

    return response.rows.map((row) => new Income(row));
  }

  static async getAllBankAccountIncome(account_id) {
    const response = await db.query(
      `SELECT
        i.account_id,
        i.income_id,
        i.income_amount,
        i.payment_date,
        i.category,
        i.repeat_income,
        i.payment_frequency,
        i.income_repeat_date
      FROM income i
      WHERE i.account_id = $1
      ORDER BY i.income_id;`,
      [account_id]
    );

    if (response.rows.length === 0) {
      throw new Error("Bank account currently has no income.");
    }

    return response.rows.map((row) => new Income(row));
  }

  static async createIncome(request_body) {
    const today = new Date().toLocaleDateString("en-CA");
    

    const {
      account_id,
      income_name,
      income_amount,
      payment_date = today,
      category,
      payment_frequency = null,
    } = request_body;

    let repeat_income = false;
    let income_repeat_date = null;
    const amount = Number(income_amount);

    if (payment_frequency) {
      const normalisedFrequency = payment_frequency.trim().toLowerCase();
      const nextDate = new Date(payment_date);

      if (!Number.isNaN(nextDate.getTime())) {
        if (normalisedFrequency === "monthly") {
          repeat_income = true;
          nextDate.setMonth(nextDate.getMonth() + 1);
          income_repeat_date = nextDate.toLocaleDateString("en-CA");
        } else if (
          normalisedFrequency === "annually" ||
          normalisedFrequency === "annual"
        ) {
          repeat_income = true;
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          income_repeat_date = nextDate.toLocaleDateString("en-CA");
        }
      }
    }

    const existingBankAccount = await db.query(
      "SELECT * FROM accounts WHERE account_id = $1",
      [account_id]
    );

    if (existingBankAccount.rows.length !== 1) {
      throw new Error("Unable to create income for account.");
    }

    
    const response = await db.query(
      `INSERT INTO income
      (account_id, income_name, income_amount, payment_date, category,
      repeat_income, payment_frequency, income_repeat_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        account_id,
        income_name,
        income_amount,
        payment_date,
        category,
        repeat_income,
        payment_frequency,
        income_repeat_date,
     ]
   );

   if (payment_date <= today) {
      await db.query(
        `UPDATE accounts
        SET account_balance = account_balance + $1
        WHERE account_id = $2`,
        [amount, account_id]
      );
    }

    const householdResponse = await db.query(
      "SELECT household_id FROM accounts WHERE account_id = $1",
      [account_id]
    );

    return new Income({
      ...response.rows[0],
      household_id: householdResponse.rows[0].household_id,
    });
  }

  static async updateIncome(request_body) {
    const today = new Date().toLocaleDateString("en-CA");

    const {
      income_id,
      income_amount,
      payment_date = today,
      category,
      payment_frequency = null,
    } = request_body;

    let repeat_income = false;
    let income_repeat_date = null;

    if (payment_frequency) {
      const normalisedFrequency = payment_frequency.trim().toLowerCase();
      const nextDate = new Date(payment_date);

      if (!Number.isNaN(nextDate.getTime())) {
        if (normalisedFrequency === "monthly") {
          repeat_income = true;
          nextDate.setMonth(nextDate.getMonth() + 1);
          income_repeat_date = nextDate.toLocaleDateString("en-CA");
        } else if (
          normalisedFrequency === "annually" ||
          normalisedFrequency === "annual"
        ) {
          repeat_income = true;
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          income_repeat_date = nextDate.toLocaleDateString("en-CA");
        }
      }
    }

    const response = await db.query(
      `UPDATE income
      SET income_amount = $1,
          payment_date = $2,
          category = $3,
          repeat_income = $4,
          payment_frequency = $5,
          income_repeat_date = $6
      WHERE income_id = $7
      RETURNING *;`,
      [
        income_amount,
        payment_date,
        category,
        repeat_income,
        payment_frequency,
        income_repeat_date,
        income_id,
      ]
    );

    if (response.rows.length !== 1) {
      throw new Error("Unable to update income.");
    }

    const householdResponse = await db.query(
      `SELECT a.household_id
      FROM accounts a
      JOIN income i ON a.account_id = i.account_id
      WHERE i.income_id = $1`,
      [income_id]
    );

    return new Income({
      ...response.rows[0],
      household_id: householdResponse.rows[0].household_id,
    });
  }

  static async deleteIncome(data) {
    const { income_id } = data;

    const response = await db.query(
      "DELETE FROM income WHERE income_id = $1 RETURNING *;",
      [income_id]
    );

    if (response.rows.length !== 1) {
      throw new Error("Unable to delete income.");
    }

    return response.rows[0];
  }
}

module.exports = Income;