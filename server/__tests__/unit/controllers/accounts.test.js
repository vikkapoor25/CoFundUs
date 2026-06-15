const { createBankAccount, deleteBankAccount } = require("../../../controllers/accounts");
const BankAccount = require("../../../models/accounts");

jest.mock("../../../models/accounts");

describe("accounts controller", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createBankAccount", () => {
    it("should return 201 and the new account when creation is successful", async () => {
      const mockAccount = {
        account_id: 1,
        household_id: 1,
        account_name: "Shared Account",
        account_balance: 1000,
        account_type: "shared",
      };

      req.body = {
        household_id: 1,
        account_name: "Shared Account",
        account_balance: 1000,
        account_type: "shared",
      };

      BankAccount.create.mockResolvedValue(mockAccount);

      await createBankAccount(req, res);

      expect(BankAccount.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockAccount);
    });

    it("should return 500 if creation fails", async () => {
      req.body = {
        household_id: 1,
        account_name: "Shared Account",
        account_balance: 1000,
        account_type: "shared",
      };

      BankAccount.create.mockRejectedValue(new Error("Database error"));

      await createBankAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("deleteBankAccount", () => {
    it("should return 200 and the deleted account when deletion is successful", async () => {
      const mockDeletedAccount = {
        account_id: 2,
        household_id: 1,
        account_name: "Savings",
        account_balance: 5000,
        account_type: "personal",
      };

      req.body = {
        account_id: 2,
      };

      BankAccount.deleteById.mockResolvedValue(mockDeletedAccount);

      await deleteBankAccount(req, res);

      expect(BankAccount.deleteById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bank account deleted",
        deletedAccount: mockDeletedAccount,
      });
    });

    it("should return 404 if the bank account is not found", async () => {
      req.body = {
        account_id: 999,
      };

      BankAccount.deleteById.mockResolvedValue(undefined);

      await deleteBankAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Bank account not found" });
    });

    it("should return 400 if income or bills are still assigned to the account", async () => {
      req.body = {
        account_id: 1,
      };

      BankAccount.deleteById.mockRejectedValue(
        new Error('update or delete on table "accounts" violates foreign key constraint')
      );

      await deleteBankAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "This account cannot be deleted because it still has income or bills assigned to it.",
      });
    });

    it("should return 500 for other delete errors", async () => {
      req.body = {
        account_id: 1,
      };

      BankAccount.deleteById.mockRejectedValue(new Error("Unexpected error"));

      await deleteBankAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Unexpected error" });
    });
  });
});