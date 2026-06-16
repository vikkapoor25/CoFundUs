const Income = require("../../../models/income");
const incomeController = require("../../../controllers/income");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}));

const mockRes = { status: mockStatus };

describe("Income controller", () => {
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.resetAllMocks());

  describe("getAllHouseholdIncomeController", () => {
    let testIncome, mockReq;

    beforeEach(() => {
      testIncome = [
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

      mockReq = { params: { household_id: 1 } };
    });

    it("should return income belonging to household_id 1 with a 200 status code", async () => {
      jest.spyOn(Income, "getAllHouseholdIncome").mockResolvedValue(testIncome);

      await incomeController.getAllHouseholdIncomeController(mockReq, mockRes);

      expect(Income.getAllHouseholdIncome).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testIncome);
      expect(Income.getAllHouseholdIncome).toHaveBeenCalledWith(1);
    });

    it("should return an error if household_id 1 has no income", async () => {
      jest
        .spyOn(Income, "getAllHouseholdIncome")
        .mockRejectedValue(new Error("Household currently has no income."));

      await incomeController.getAllHouseholdIncomeController(mockReq, mockRes);

      expect(Income.getAllHouseholdIncome).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Household currently has no income." });
    });
  });

  describe("getAllBankAccountIncomeController", () => {
    let testIncome, mockReq;

    beforeEach(() => {
      testIncome = [
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

      mockReq = { params: { account_id: 1 } };
    });

    it("should return income belonging to account_id 1 with a 200 status code", async () => {
      jest.spyOn(Income, "getAllBankAccountIncome").mockResolvedValue(testIncome);

      await incomeController.getAllBankAccountIncomeController(mockReq, mockRes);

      expect(Income.getAllBankAccountIncome).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testIncome);
      expect(Income.getAllBankAccountIncome).toHaveBeenCalledWith(1);
    });

    it("should return an error if account_id 1 has no income", async () => {
      jest
        .spyOn(Income, "getAllBankAccountIncome")
        .mockRejectedValue(new Error("Bank account currently has no income."));

      await incomeController.getAllBankAccountIncomeController(mockReq, mockRes);

      expect(Income.getAllBankAccountIncome).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Bank account currently has no income." });
    });
  });

  describe("createIncomeController", () => {
    it("should return a new income for an account with a 201 status code", async () => {
      const testIncome = {
        account_id: 1,
        income_amount: 3000,
        date: "2026-07-09",
        category: "Salary",
        repeat: true,
        income_frequency: "Monthly",
        income_repeat_date: "2026-08-09",
      };

      const mockReq = { body: testIncome };

      const createdIncome = {
        household_id: 1,
        income_id: 1,
        account_id: 1,
        income_amount: 3000,
        payment_date: "2026-07-09",
        category: "Salary",
        repeat_income: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-09",
      };

      jest.spyOn(Income, "createIncome").mockResolvedValue(createdIncome);

      await incomeController.createIncomeController(mockReq, mockRes);

      expect(Income.createIncome).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(createdIncome);
      expect(Income.createIncome).toHaveBeenCalledWith(testIncome);
    });

    it("should return an error if income creation fails", async () => {
      const testIncome = { account_id: 999, income_amount: 3000 };
      const mockReq = { body: testIncome };

      jest
        .spyOn(Income, "createIncome")
        .mockRejectedValue(new Error("Unable to create income for account."));

      await incomeController.createIncomeController(mockReq, mockRes);

      expect(Income.createIncome).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to create income for account." });
    });
  });

  describe("updateIncomeController", () => {
    it("should update income and return it with a 200 status code", async () => {
      const updateRequest = {
        income_id: 1,
        income_amount: 3500,
        date: "2026-07-15",
        repeat: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-15",
      };

      const mockReq = { body: updateRequest };

      const updatedIncome = {
        household_id: 1,
        income_id: 1,
        account_id: 1,
        income_amount: 3500,
        payment_date: "2026-07-15",
        category: "Salary",
        repeat_income: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-15",
      };

      jest.spyOn(Income, "updateIncome").mockResolvedValue(updatedIncome);

      await incomeController.updateIncomeController(mockReq, mockRes);

      expect(Income.updateIncome).toHaveBeenCalledTimes(1);
      expect(Income.updateIncome).toHaveBeenCalledWith(updateRequest);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(updatedIncome);
    });

    it("should return an error if income does not exist", async () => {
      const updateRequest = { income_id: 999, income_amount: 3500 };
      const mockReq = { body: updateRequest };

      jest.spyOn(Income, "updateIncome").mockRejectedValue(new Error("Unable to update income."));

      await incomeController.updateIncomeController(mockReq, mockRes);

      expect(Income.updateIncome).toHaveBeenCalledTimes(1);
      expect(Income.updateIncome).toHaveBeenCalledWith(updateRequest);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to update income." });
    });
  });

  describe("deleteIncomeController", () => {
    it("should return a 204 status code on successful deletion", async () => {
      const mockReq = { body: { income_id: 1 } };

      jest.spyOn(Income, "deleteIncome").mockResolvedValue({});

      await incomeController.deleteIncomeController(mockReq, mockRes);

      expect(Income.deleteIncome).toHaveBeenCalledTimes(1);
      expect(Income.deleteIncome).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
    });

    it("should return an error if income is not found", async () => {
      const mockReq = { body: { income_id: 999 } };

      jest.spyOn(Income, "deleteIncome").mockRejectedValue(new Error("Unable to delete income."));

      await incomeController.deleteIncomeController(mockReq, mockRes);

      expect(Income.deleteIncome).toHaveBeenCalledTimes(1);
      expect(Income.deleteIncome).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to delete income." });
    });
  });
});