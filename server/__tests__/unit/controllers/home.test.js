const Home = require("../../../models/Home");
const homeController = require("../../../controllers/home");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}));

const mockRes = { status: mockStatus };

describe("Home controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("getHomeSummaryController", () => {
    it("should return dashboard summary with status 200", async () => {
      const mockReq = { params: { household_id: 1 } };
      const summary = {
        overall_account_balance: 25000,
        income_vs_bills: {
          overall_income: 3000,
          overall_bills: 200,
        },
        net_gain_loss: 2800,
        upcoming_bills: [],
        closest_goal: {
          goal_name: "iphone",
          goal_amount: 500,
          current_value: 200,
          target_date: "2026-08-09",
        },
      };

      jest.spyOn(Home, "getHomeSummary").mockResolvedValue(summary);

      await homeController.getHomeSummaryController(mockReq, mockRes);

      expect(Home.getHomeSummary).toHaveBeenCalledTimes(1);
      expect(Home.getHomeSummary).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(summary);
    });

    it("should return error with status 500", async () => {
      const mockReq = { params: { household_id: 999 } };

      jest
        .spyOn(Home, "getHomeSummary")
        .mockRejectedValue(new Error("Dashboard failed."));

      await homeController.getHomeSummaryController(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Dashboard failed." });
    });
  });

  describe("getUpcomingBillsController", () => {
    it("should return upcoming bills with status 200", async () => {
      const mockReq = { params: { household_id: 1 } };
      const bills = [
        {
          bill_name: "Internet",
          account_name: "shared",
          bill_amount: 50,
          bill_due_date: "2026-06-17",
        },
      ];

      jest.spyOn(Home, "getUpcomingBills").mockResolvedValue(bills);

      await homeController.getUpcomingBillsController(mockReq, mockRes);

      expect(Home.getUpcomingBills).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(bills);
    });

    it("should return error with status 500", async () => {
      const mockReq = { params: { household_id: 999 } };

      jest
        .spyOn(Home, "getUpcomingBills")
        .mockRejectedValue(new Error("Upcoming bills failed."));

      await homeController.getUpcomingBillsController(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Upcoming bills failed." });
    });
  });

  describe("getNetGainLossController", () => {
    it("should return net gain/loss with status 200", async () => {
      const mockReq = { params: { household_id: 1 } };
      const net = { net_gain_loss: 2800 };

      jest.spyOn(Home, "getNetGainLoss").mockResolvedValue(net);

      await homeController.getNetGainLossController(mockReq, mockRes);

      expect(Home.getNetGainLoss).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(net);
    });

    it("should return error with status 500", async () => {
      const mockReq = { params: { household_id: 999 } };

      jest
        .spyOn(Home, "getNetGainLoss")
        .mockRejectedValue(new Error("Net gain/loss failed."));

      await homeController.getNetGainLossController(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Net gain/loss failed." });
    });
  });

  describe("getClosestGoalController", () => {
    it("should return closest goal with status 200", async () => {
      const mockReq = { params: { household_id: 1 } };
      const goal = {
        goal_name: "iphone",
        goal_amount: 500,
        current_value: 200,
        target_date: "2026-08-09",
      };

      jest.spyOn(Home, "getClosestGoal").mockResolvedValue(goal);

      await homeController.getClosestGoalController(mockReq, mockRes);

      expect(Home.getClosestGoal).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(goal);
    });

    it("should return error with status 500", async () => {
      const mockReq = { params: { household_id: 999 } };

      jest
        .spyOn(Home, "getClosestGoal")
        .mockRejectedValue(new Error("Closest goal failed."));

      await homeController.getClosestGoalController(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Closest goal failed." });
    });
  });
});