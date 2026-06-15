const request = require("supertest");
const app = require("../../app");
const db = require("../../database/connect");
const { resetTestDB } = require("./config");

describe("Bank Accounts API Endpoints", () => {
  let api;

  beforeEach(async () => {
    await resetTestDB();
  });

  beforeAll(() => {
    api = app.listen(4001, () => {
      console.log("Test server running on port 4001");
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => api.close(resolve));
    await db.end();
  });

  describe("GET /bank-accounts/:household_id", () => {
    it("should return all bank accounts for a household with income, bills, and net gain/loss", async () => {
      const response = await request(api).get("/bank-accounts/1");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("household_id", 1);
      expect(response.body[0]).toHaveProperty("income_total");
      expect(response.body[0]).toHaveProperty("bills_total");
      expect(response.body[0]).toHaveProperty("net_gain_loss");
    });

    it("should return an empty array if the household has no bank accounts", async () => {
      const response = await request(api).get("/bank-accounts/999");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("POST /bank-accounts/new", () => {
    it("should create a new bank account and return it", async () => {
      const newAccount = {
        household_id: 1,
        account_name: "Test Shared Account",
        account_balance: 1234,
        account_type: "shared",
      };

      const response = await request(api)
        .post("/bank-accounts/new")
        .send(newAccount);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("account_id");
      expect(response.body).toHaveProperty("household_id", 1);
      expect(response.body).toHaveProperty("account_name", "Test Shared Account");
      expect(response.body).toHaveProperty("account_balance", 1234);
      expect(response.body).toHaveProperty("account_type", "shared");
    });
  });

  describe("DELETE /bank-accounts/delete", () => {
    it("should return 400 if income or bills are still assigned to the account", async () => {
      const response = await request(api)
        .delete("/bank-accounts/delete")
        .send({ account_id: 1 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "This account cannot be deleted because it still has income or bills assigned to it."
      );
    });

    it("should delete a bank account and return 200 when the account is safe to delete", async () => {
      const createResponse = await request(api)
        .post("/bank-accounts/new")
        .send({
          household_id: 1,
          account_name: "Temporary Account",
          account_balance: 500,
          account_type: "personal",
        });

      const accountId = createResponse.body.account_id;

      const deleteResponse = await request(api)
        .delete("/bank-accounts/delete")
        .send({ account_id: accountId });

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty("message", "Bank account deleted");
      expect(deleteResponse.body.deletedAccount).toHaveProperty("account_id", accountId);
      expect(deleteResponse.body.deletedAccount).toHaveProperty("account_name", "Temporary Account");
    });
  });
});