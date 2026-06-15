const Income = require("../../../models/income");
const db = require("../../../database/connect");

describe("Income", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("getAllHouseholdIncome", () => {
    it("resolves with all income belonging to a household on successful db query", async () => {
      const testIncome = [
        {
          household_id: 1,
          income_id: 1,
          account_id: 1,
          income_amount: 3000,
          payment_date: "2026-07-09",
          category: "Salary",
          repeat_income: true,
          payment_frequency: "Monthly",
          income_repeat_date: "2026-08-09",
        },
        {
          household_id: 1,
          income_id: 2,
          account_id: 2,
          income_amount: 1500,
          payment_date: "2026-07-10",
          category: "Freelance",
          repeat_income: false,
          payment_frequency: null,
          income_repeat_date: null,
        },
      ];

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: testIncome });

      const result = await Income.getAllHouseholdIncome(1);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Income);
      expect(result[1]).toBeInstanceOf(Income);
      expect(result[0].income_amount).toBe(3000);
      expect(result[1].category).toBe("Freelance");
      expect(result[0].household_id).toBe(1);
      expect(result[1].household_id).toBe(1);
      expect(db.query).toHaveBeenCalledWith(
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
        [1]
      );
    });

    it("should throw an Error when a household has no income", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(Income.getAllHouseholdIncome(999)).rejects.toThrow(
        "Household currently has no income."
      );
    });
  });

  describe("getAllBankAccountIncome", () => {
    it("resolves with all income belonging to a bank account on successful db query", async () => {
      const testIncome = [
        {
          income_id: 1,
          account_id: 1,
          income_amount: 3000,
          payment_date: "2026-07-09",
          category: "Salary",
          repeat_income: true,
          payment_frequency: "Monthly",
          income_repeat_date: "2026-08-09",
        },
        {
          income_id: 2,
          account_id: 1,
          income_amount: 500,
          payment_date: "2026-07-11",
          category: "Bonus",
          repeat_income: false,
          payment_frequency: null,
          income_repeat_date: null,
        },
      ];

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: testIncome });

      const result = await Income.getAllBankAccountIncome(1);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Income);
      expect(result[1]).toBeInstanceOf(Income);
      expect(result[0].account_id).toBe(1);
      expect(result[1].category).toBe("Bonus");
      expect(db.query).toHaveBeenCalledWith(
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
        [1]
      );
    });

    it("should throw an Error when a bank account has no income", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(Income.getAllBankAccountIncome(999)).rejects.toThrow(
        "Bank account currently has no income."
      );
    });
  });

  describe("createIncome", () => {
    it("resolves with income on successful creation", async () => {
      const mockCreateIncome = {
        account_id: 1,
        income_amount: 3000,
        date: "2026-07-09",
        category: "Salary",
        repeat: true,
        income_frequency: "Monthly",
        income_repeat_date: "2026-08-09",
      };

      const mockInsertedIncome = {
        income_id: 1,
        account_id: 1,
        income_amount: 3000,
        payment_date: "2026-07-09",
        category: "Salary",
        repeat_income: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-09",
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ account_id: 1 }] });
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockInsertedIncome] });
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ household_id: 1 }] });

      const result = await Income.createIncome(mockCreateIncome);

      expect(result).toBeInstanceOf(Income);
      expect(result).toHaveProperty("income_amount", 3000);
      expect(result).toHaveProperty("category", "Salary");
      expect(result).toHaveProperty("payment_frequency", "Monthly");
      expect(result).toHaveProperty("household_id", 1);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        "SELECT * FROM accounts WHERE account_id = $1",
        [1]
      );
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        `INSERT INTO income
      (account_id, income_amount, payment_date, category, repeat_income, payment_frequency, income_repeat_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`,
        [1, 3000, "2026-07-09", "Salary", true, "Monthly", "2026-08-09"]
      );
      expect(db.query).toHaveBeenNthCalledWith(
        3,
        "SELECT household_id FROM accounts WHERE account_id = $1",
        [1]
      );
    });

    it("should throw an Error when bank account does not exist", async () => {
      const mockCreateIncome = {
        account_id: 999,
        income_amount: 3000,
        category: "Salary",
        repeat: true,
        income_frequency: "Monthly",
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(Income.createIncome(mockCreateIncome)).rejects.toThrow(
        "Unable to create income for account."
      );
    });
  });

  describe("updateIncome", () => {
    it("should return the updated income on successful update", async () => {
      const updateIncomeRequest = {
        income_id: 1,
        income_amount: 3500,
        date: "2026-07-15",
        repeat: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-15",
      };

      const updatedIncome = {
        income_id: 1,
        account_id: 1,
        income_amount: 3500,
        payment_date: "2026-07-15",
        category: "Salary",
        repeat_income: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-15",
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [updatedIncome] });
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ household_id: 1 }] });

      const result = await Income.updateIncome(updateIncomeRequest);

      expect(result).toBeInstanceOf(Income);
      expect(result.income_id).toBe(1);
      expect(result.income_amount).toBe(3500);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        `UPDATE income
      SET income_amount = $1,
          payment_date = $2,
          repeat_income = $3,
          payment_frequency = $4,
          income_repeat_date = $5
      WHERE income_id = $6
      RETURNING *;`,
        [3500, "2026-07-15", true, "Monthly", "2026-08-15", 1]
      );
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        `SELECT a.household_id
      FROM accounts a
      JOIN income i ON a.account_id = i.account_id
      WHERE i.income_id = $1`,
        [1]
      );
    });

    it("should throw an Error if pre-existing income does not exist", async () => {
      const updateIncomeRequest = {
        income_id: 999,
        income_amount: 3500,
        date: "2026-07-15",
        repeat: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-15",
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(Income.updateIncome(updateIncomeRequest)).rejects.toThrow(
        "Unable to update income."
      );
    });
  });

  describe("deleteIncome", () => {
    it("should return the deleted income on successful deletion", async () => {
      const deleteIncomeRequest = { income_id: 1 };

      const deletedIncome = {
        income_id: 1,
        account_id: 1,
        income_amount: 3000,
        payment_date: "2026-07-09",
        category: "Salary",
        repeat_income: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-09",
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [deletedIncome] });

      const result = await Income.deleteIncome(deleteIncomeRequest);

      expect(result.income_id).toBe(1);
      expect(result.income_amount).toBe(3000);
      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM income WHERE income_id = $1 RETURNING *;",
        [1]
      );
    });

    it("should throw an Error when income does not exist", async () => {
      const deleteIncomeRequest = { income_id: 999 };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(Income.deleteIncome(deleteIncomeRequest)).rejects.toThrow(
        "Unable to delete income."
      );
    });
  });
});