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
}

module.exports = BankAccount;