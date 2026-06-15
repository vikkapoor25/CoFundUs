const BankAccount = require("../../../models/accounts");
const db = require("../../../database/connect");

describe("BankAccount model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBalanceByHouseholdId", () => {
  it("should return total balance for a household", async () => {
    const mockResponse = {
      rows: [{ household_id: 1, total_balance: 25000 }],
    };

    jest.spyOn(db, "query").mockResolvedValue(mockResponse);

    const result = await BankAccount.getBalanceByHouseholdId(1);

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ household_id: 1, total_balance: 25000 });
  });

  it("should return 0 balance if household has no accounts", async () => {
    jest.spyOn(db, "query").mockResolvedValue({ rows: [] });

    const result = await BankAccount.getBalanceByHouseholdId(999);

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ household_id: 999, total_balance: 0 });
  });
});

  describe("create", () => {
    it("should create a new bank account and return it", async () => {
      const mockAccount = {
        account_id: 1,
        household_id: 1,
        account_name: "Shared Account",
        account_balance: 1000,
        account_type: "shared",
      };

      const mockResponse = {
        rows: [mockAccount],
      };

      jest.spyOn(db, "query").mockResolvedValue(mockResponse);

      const data = {
        household_id: 1,
        account_name: "Shared Account",
        account_balance: 1000,
        account_type: "shared",
      };

      const result = await BankAccount.create(data);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("account_id", 1);
      expect(result).toHaveProperty("household_id", 1);
      expect(result).toHaveProperty("account_name", "Shared Account");
      expect(result).toHaveProperty("account_balance", 1000);
      expect(result).toHaveProperty("account_type", "shared");
    });

    it("should throw an error if the database query fails", async () => {
      jest.spyOn(db, "query").mockRejectedValue(new Error("Database error"));

      const data = {
        household_id: 1,
        account_name: "Shared Account",
        account_balance: 1000,
        account_type: "shared",
      };

      await expect(BankAccount.create(data)).rejects.toThrow("Database error");
    });
  });

  describe("deleteById", () => {
    it("should delete a bank account and return it", async () => {
      const mockDeletedAccount = {
        account_id: 2,
        household_id: 1,
        account_name: "Savings",
        account_balance: 5000,
        account_type: "personal",
      };

      const mockResponse = {
        rows: [mockDeletedAccount],
      };

      jest.spyOn(db, "query").mockResolvedValue(mockResponse);

      const result = await BankAccount.deleteById(2);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("account_id", 2);
      expect(result).toHaveProperty("account_name", "Savings");
      expect(result).toHaveProperty("account_balance", 5000);
      expect(result).toHaveProperty("account_type", "personal");
    });

    it("should return undefined if the bank account is not found", async () => {
      const mockResponse = {
        rows: [],
      };

      jest.spyOn(db, "query").mockResolvedValue(mockResponse);

      const result = await BankAccount.deleteById(999);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe("getByHouseholdId", () => {
    it("should return all bank accounts for a household", async () => {
      const mockAccounts = [
        {
          account_id: 1,
          household_id: 1,
          account_name: "Shared Account",
          account_balance: 1000,
          account_type: "shared",
          allocated_to_goal: 200,
          income_total: 3000,
          bills_total: 200,
          net_gain_loss: 2800,
        },
        {
          account_id: 2,
          household_id: 1,
          account_name: "Savings",
          account_balance: 5000,
          account_type: "personal",
          allocated_to_goal: 0,
          income_total: 0,
          bills_total: 0,
          net_gain_loss: 0,
        },
      ];

      jest.spyOn(db, "query").mockResolvedValue({ rows: mockAccounts });

      const result = await BankAccount.getByHouseholdId(1);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("household_id", 1);
      expect(result[0]).toHaveProperty("income_total", 3000);
      expect(result[0]).toHaveProperty("bills_total", 200);
      expect(result[0]).toHaveProperty("net_gain_loss", 2800);
    });

    it("should return an empty array if the household has no accounts", async () => {
      jest.spyOn(db, "query").mockResolvedValue({ rows: [] });

      const result = await BankAccount.getByHouseholdId(999);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});