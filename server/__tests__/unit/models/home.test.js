const Home = require("../../../models/Home");
const db = require("../../../database/connect");

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("getOverallAccountBalance", () => {
    it("should return overall account balance", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({
        rows: [{ overall_account_balance: 25000 }],
      });

      const result = await Home.getOverallAccountBalance(1);

      expect(result).toBe(25000);
      expect(db.query).toHaveBeenCalledWith(
        `SELECT COALESCE(SUM(account_balance), 0) AS overall_account_balance
       FROM accounts
       WHERE household_id = $1;`,
        [1]
      );
    });
  });

  describe("getIncomeVsBills", () => {
    it("should return overall income and overall bills", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({
        rows: [{ overall_income: 3000 }],
      });
      jest.spyOn(db, "query").mockResolvedValueOnce({
        rows: [{ overall_bills: 200 }],
      });

      const result = await Home.getIncomeVsBills(1);

      expect(result).toEqual({
        overall_income: 3000,
        overall_bills: 200,
      });
    });
  });

  describe("getNetGainLoss", () => {
    it("should return net gain/loss", async () => {
      jest.spyOn(Home, "getIncomeVsBills").mockResolvedValueOnce({
        overall_income: 3000,
        overall_bills: 200,
      });

      const result = await Home.getNetGainLoss(1);

      expect(result).toEqual({ net_gain_loss: 2800 });
      expect(Home.getIncomeVsBills).toHaveBeenCalledWith(1);
    });
  });

  describe("getUpcomingBills", () => {
    it("should return bills due within 7 days", async () => {
      const testBills = [
        {
          bill_name: "Internet",
          account_name: "shared",
          bill_amount: 50,
          bill_due_date: "2026-06-17",
        },
        {
          bill_name: "Gym",
          account_name: "savings",
          bill_amount: 30,
          bill_due_date: "2026-06-18",
        },
      ];

      jest.spyOn(db, "query").mockResolvedValueOnce({
        rows: testBills,
      });

      const result = await Home.getUpcomingBills(1);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("bill_name", "Internet");
      expect(result[0]).toHaveProperty("account_name", "shared");
      expect(result[0]).toHaveProperty("bill_amount", 50);
    });

    it("should return an empty array when there are no upcoming bills", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({
        rows: [],
      });

      const result = await Home.getUpcomingBills(1);

      expect(result).toEqual([]);
    });
  });

  describe("getClosestGoal", () => {
    it("should return the goal closest to completion", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({
        rows: [
          {
            goal_name: "iphone",
            goal_amount: 500,
            current_value: 200,
            target_date: "2026-08-09",
          },
        ],
      });

      const result = await Home.getClosestGoal(1);

      expect(result).toEqual({
        goal_name: "iphone",
        goal_amount: 500,
        current_value: 200,
        target_date: "2026-08-09",
      });
    });

    it("should return null when there are no goals", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({
        rows: [],
      });

      const result = await Home.getClosestGoal(999);

      expect(result).toBeNull();
    });
  });

  describe("getHomeSummary", () => {
    it("should return the dashboard summary", async () => {
      jest.spyOn(Home, "getOverallAccountBalance").mockResolvedValueOnce(25000);
      jest.spyOn(Home, "getIncomeVsBills").mockResolvedValueOnce({
        overall_income: 3000,
        overall_bills: 200,
      });
      jest.spyOn(Home, "getNetGainLoss").mockResolvedValueOnce({
        net_gain_loss: 2800,
      });
      jest.spyOn(Home, "getUpcomingBills").mockResolvedValueOnce([
        {
          bill_name: "Internet",
          account_name: "shared",
          bill_amount: 50,
          bill_due_date: "2026-06-17",
        },
      ]);
      jest.spyOn(Home, "getClosestGoal").mockResolvedValueOnce({
        goal_name: "iphone",
        goal_amount: 500,
        current_value: 200,
        target_date: "2026-08-09",
      });

      const result = await Home.getHomeSummary(1);

      expect(result).toEqual({
        overall_account_balance: 25000,
        income_vs_bills: {
          overall_income: 3000,
          overall_bills: 200,
        },
        net_gain_loss: 2800,
        upcoming_bills: [
          {
            bill_name: "Internet",
            account_name: "shared",
            bill_amount: 50,
            bill_due_date: "2026-06-17",
          },
        ],
        closest_goal: {
          goal_name: "iphone",
          goal_amount: 500,
          current_value: 200,
          target_date: "2026-08-09",
        },
      });
    });
  });
});