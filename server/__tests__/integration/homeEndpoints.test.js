const request = require("supertest");
const app = require("../../app");
const db = require("../../database/connect");
const { resetTestDB } = require("./config");

describe("Home API Endpoints", () => {
  let api;

  beforeEach(async () => {
    await resetTestDB();
  });

  beforeAll(() => {
    api = app.listen(4003, () => {
      console.log("Test server running on port 4003");
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => api.close(resolve));
    await db.end();
  });

  describe("GET /home/:household_id", () => {
    it("should return dashboard summary for a household", async () => {
      const response = await request(api).get("/home/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("overall_account_balance");
      expect(response.body).toHaveProperty("income_vs_bills");
      expect(response.body).toHaveProperty("net_gain_loss");
      expect(response.body).toHaveProperty("upcoming_bills");
      expect(response.body).toHaveProperty("closest_goal");

      expect(response.body.overall_account_balance).toBe(25000);
      expect(response.body.income_vs_bills.overall_income).toBe(3000);
      expect(response.body.income_vs_bills.overall_bills).toBe(200);
      expect(response.body.net_gain_loss).toBe(2800);
    });
  });

  describe("GET /home/bills/:household_id", () => {
    it("should return bills due within 7 days", async () => {
      await db.query(
        `INSERT INTO bills
          (account_id, bill_amount, bill_name, bill_due_date, category, category_type, repeat_bill, payment_frequency, bill_repeat_date, paid)
         VALUES
          (1, 50, 'Internet', CURRENT_DATE + INTERVAL '2 days', 'Utilities', 'Home', true, 'Monthly', CURRENT_DATE + INTERVAL '32 days', false);`
      );

      const response = await request(api).get("/home/bills/1");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("bill_name");
      expect(response.body[0]).toHaveProperty("account_name");
      expect(response.body[0]).toHaveProperty("bill_amount");
      expect(response.body[0]).toHaveProperty("bill_due_date");
    });
  });

  describe("GET /home/net/:household_id", () => {
    it("should return net gain/loss for a household", async () => {
      const response = await request(api).get("/home/net/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ net_gain_loss: 2800 });
    });
  });

  describe("GET /home/goal/:household_id", () => {
    it("should return the goal closest to completion", async () => {
      const response = await request(api).get("/home/goal/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("goal_name");
      expect(response.body).toHaveProperty("goal_amount");
      expect(response.body).toHaveProperty("current_value");
      expect(response.body.goal_name).toBe("iphone");
    });
  });
});