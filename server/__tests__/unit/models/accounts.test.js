const BankAccount = require("../../../models/accounts");
const db = require("../../../database/connect");

describe("BankAccount model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});