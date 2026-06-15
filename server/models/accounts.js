const db = require("../database/connect");

class BankAccount {
  static async create(data) {
    const { household_id, account_name, account_balance, account_type } = data;

    const result = await db.query(
      `INSERT INTO accounts
      (household_id, account_name, account_balance, account_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`,
      [household_id, account_name, account_balance, account_type]
    );

    return result.rows[0];
  }

  static async deleteById(account_id) {
    const result = await db.query(
      `DELETE FROM accounts
      WHERE account_id = $1
      RETURNING *;`,
      [account_id]
    );

    return result.rows[0];
  }

  static async getByHouseholdId(household_id) {
    const result = await db.query(
      `SELECT
        a.account_id,
        a.household_id,
        a.account_name,
        a.account_balance,
        a.account_type,
        a.allocated_to_goal,
       COALESCE(i.total_income, 0)::INT AS income_total,
       COALESCE(b.total_bills, 0)::INT AS bills_total,
       (COALESCE(i.total_income, 0) - COALESCE(b.total_bills, 0))::INT AS net_gain_loss
      FROM accounts a
      LEFT JOIN (
        SELECT account_id, SUM(income_amount) AS total_income
        FROM income
        GROUP BY account_id
      ) i ON a.account_id = i.account_id
      LEFT JOIN (
        SELECT account_id, SUM(bill_amount) AS total_bills
        FROM bills
        GROUP BY account_id
      ) b ON a.account_id = b.account_id
      WHERE a.household_id = $1
      ORDER BY a.account_id;`,
      [household_id]
    );

    return result.rows;
  }

  static async getBalanceByHouseholdId(household_id) {
  const result = await db.query(
    `SELECT
        household_id,
        COALESCE(SUM(account_balance), 0)::INT AS total_balance
     FROM accounts
     WHERE household_id = $1
     GROUP BY household_id;`,
    [household_id]
  );

  if (result.rows.length === 0) {
    return {
      household_id: Number(household_id),
      total_balance: 0,
    };
  }

  return result.rows[0];
}

}

module.exports = BankAccount;