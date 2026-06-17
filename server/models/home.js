const db = require("../database/connect");

class Home {
  static async getOverallAccountBalance(household_id) {
    const response = await db.query(
      `SELECT COALESCE(SUM(account_balance), 0) AS overall_account_balance
       FROM accounts
       WHERE household_id = $1;`,
      [household_id]
    );

    return Number(response.rows[0].overall_account_balance);
  }

  static async getIncomeVsBills(household_id) {
    const incomeResponse = await db.query(
      `SELECT COALESCE(SUM(i.income_amount), 0) AS overall_income
      FROM income i
      JOIN accounts a ON i.account_id = a.account_id
      WHERE a.household_id = $1
      AND i.payment_date <= CURRENT_DATE;`,
      [household_id]
  );

    const billsResponse = await db.query(
      `SELECT COALESCE(SUM(b.bill_amount), 0) AS overall_bills
       FROM bills b
       JOIN accounts a ON b.account_id = a.account_id
       WHERE a.household_id = $1
       AND b.paid = 'true';`,
      [household_id]
    );

    return {
      overall_income: Number(incomeResponse.rows[0].overall_income),
      overall_bills: Number(billsResponse.rows[0].overall_bills),
    };
  }

  static async getNetGainLoss(household_id) {
    const totals = await Home.getIncomeVsBills(household_id);

    return {
      net_gain_loss: totals.overall_income - totals.overall_bills,
    };
  }

  static async getUpcomingBills(household_id) {
    const response = await db.query(
      `SELECT
          b.bill_name,
          a.account_name,
          b.bill_amount,
          b.bill_due_date
       FROM bills b
       JOIN accounts a ON b.account_id = a.account_id
       WHERE a.household_id = $1
         AND b.paid = false
         AND b.bill_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
       ORDER BY b.bill_due_date;`,
      [household_id]
    );

    return response.rows.map((row) => ({
      ...row,
      bill_due_date: row.bill_due_date
        ? new Date(row.bill_due_date).toLocaleDateString("en-CA")
        : null,
    }));
  }

  static async getClosestGoal(household_id) {
    const response = await db.query(
      `SELECT
          goal_name,
          goal_amount,
          current_value,
          target_date
       FROM goals
       WHERE household_id = $1
       ORDER BY
         CASE
           WHEN goal_amount = 0 THEN 0
           ELSE current_value::float / goal_amount
         END DESC
       LIMIT 1;`,
      [household_id]
    );

    if (response.rows.length === 0) {
      return null;
    }

    const goal = response.rows[0];

    return {
      ...goal,
      goal_amount: Number(goal.goal_amount),
      current_value: Number(goal.current_value),
      target_date: goal.target_date
        ? new Date(goal.target_date).toLocaleDateString("en-CA")
        : null,
    };
  }

  static async getHomeSummary(household_id) {
    const overall_account_balance = await Home.getOverallAccountBalance(household_id);
    const income_vs_bills = await Home.getIncomeVsBills(household_id);
    const net = await Home.getNetGainLoss(household_id);
    const upcoming_bills = await Home.getUpcomingBills(household_id);
    const closest_goal = await Home.getClosestGoal(household_id);

    return {
      overall_account_balance,
      income_vs_bills,
      net_gain_loss: net.net_gain_loss,
      upcoming_bills,
      closest_goal,
    };
  }
}

module.exports = Home;