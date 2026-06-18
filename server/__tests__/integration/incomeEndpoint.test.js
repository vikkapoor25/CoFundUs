const request = require("supertest");
const app = require("../../app");
const db = require("../../database/connect");
const { resetTestDB } = require("./config");

describe("Income API Endpoints", () => {
  let api;

  beforeEach(async () => {
    await resetTestDB();
  });

  beforeAll(() => {
    api = app.listen(4002, () => {
      console.log("Test server running on port 4002");
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => api.close(resolve));
    await db.end();
  });

  describe("GET /income/household/:household_id", () => {
    it("should return all income belonging to a household with status code 200", async () => {
      const response = await request(api).get("/income/household/1");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].household_id).toBe(1);
      expect(response.body[0]).toHaveProperty("income_amount");
      expect(response.body[0]).toHaveProperty("category");
    });

    it("should return an error if household has no income", async () => {
      const response = await request(api).get("/income/household/999");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Household currently has no income." });
    });
  });

  describe("GET /income/bank-account/:account_id", () => {
    it("should return all income belonging to a bank account with status code 200", async () => {
      const response = await request(api).get("/income/bank-account/1");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].account_id).toBe(1);
      expect(response.body[0]).toHaveProperty("income_amount");
    });

    it("should return an error if bank account has no income", async () => {
      const response = await request(api).get("/income/bank-account/999");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Bank account currently has no income." });
    });
  });

  describe("POST /income/new", () => {
    it("should create a new income with status code 201", async () => {
      const newIncome = {
        account_id: 1,
        income_amount: 3000,
        payment_date: "2026-07-09",
        category: "Salary",
        repeat: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-09",
      };

      const response = await request(api).post("/income/new").send(newIncome);

      expect(response.status).toBe(201);
      expect(response.body.account_id).toBe(1);
      expect(response.body.income_amount).toBe(3000);
      expect(response.body.category).toBe("Salary");
      expect(response.body.repeat_income).toBe(true);
      expect(response.body.payment_frequency).toBe("Monthly");
    });

    it("should return an error if account does not exist", async () => {
      const invalidIncome = {
        account_id: 999,
        income_amount: 3000,
        category: "Salary",
        repeat: true,
        payment_frequency: "Monthly",
      };

      const response = await request(api).post("/income/new").send(invalidIncome);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Unable to create income for account." });
    });
  });

  describe("PATCH /income/update", () => {
    it("should update an income with status code 200", async () => {
      const updatedIncome = {
        income_id: 1,
        income_amount: 3500,
        payment_date: "2026-07-15",
        repeat: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-15",
      };

      const response = await request(api).patch("/income/update").send(updatedIncome);

      expect(response.status).toBe(200);
      expect(response.body.income_id).toBe(1);
      expect(response.body.income_amount).toBe(3500);
      expect(response.body.payment_date).toBe("2026-07-15");
      expect(response.body.repeat_income).toBe(true);
      expect(response.body.payment_frequency).toBe("Monthly");
    });

    it("should return an error if income does not exist", async () => {
      const updatedIncome = {
        income_id: 999,
        income_amount: 3500,
        payment_date: "2026-07-15",
        repeat: true,
        payment_frequency: "Monthly",
        income_repeat_date: "2026-08-15",
      };

      const response = await request(api).patch("/income/update").send(updatedIncome);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Unable to update income." });
    });
  });

  describe("DELETE /income/delete", () => {
    it("should delete an income with status code 204", async () => {
      const response = await request(api).delete("/income/delete").send({ income_id: 1 });

      expect(response.status).toBe(204);
    });

    it("should return an error if income does not exist", async () => {
      const response = await request(api).delete("/income/delete").send({ income_id: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Unable to delete income." });
    });
  });
});