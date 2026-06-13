// Imports Bill model being tested
const Bill = require('../../../models/Bill')
// Imports database connection module
const db = require('../../../database/connect')

// Main test suite for Bill model ---------------------------------------
describe('Bill', () => {

  // Runs before each test
  // Clears mock call history between tests
  beforeEach(() => jest.clearAllMocks())
  // Runs once after all tests finish
  // Resets mocked implementations
  afterAll(() => jest.resetAllMocks())

  // Test suite for Bill.getAllHouseholdBills() ---------------------------------------
  describe ('getAllHouseholdBills', () => {

    // Tests successful lookup for bills belonging to a household
    it('resolves with all bills belonging to a household on successful db query', async () => {

      // ARRANGE -----------------------------------------------------------
      // Fake Bill rows
      const testBills = [
        { household_id : 1, account_id : 1, bill_id: 1, bill_name: "Netflix", bill_amount: 7, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false },
        { household_id : 1, account_id : 2, bill_id: 2, bill_name: "Spotify", bill_amount: 12, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false}
      ]
      // Mocks database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testBills });

      // ACT ----------------------------------------------------------------
      // Runs Bill.getAllHouseholdBills()
      const result = await Bill.getAllHouseholdBills(1);

      // ASSERT -------------------------------------------------------------
      // Confirms the number of bill objects in outputs
      expect(result).toHaveLength(2);
      // Checks first object returned is a Bill instance
      expect(result[0]).toBeInstanceOf(Bill);
      // Checks second object returned is a Bill instance
      expect(result[1]).toBeInstanceOf(Bill);
      // Checks first bill's name
      expect(result[0].bill_name).toBe('Netflix');
      // Checks second bill's name
      expect(result[1].bill_name).toBe('Spotify');
      // Confirm's the first bill belongs to the expected househould
      expect(result[0].household_id).toBe(1);
      // Confirm's the second bill belongs to the expected househould
      expect(result[1].household_id).toBe(1);
      // Checks correct SQL query and parameter
      expect(db.query).toHaveBeenCalledWith("SELECT a.household_id, b.account_id, b.bill_id, b.bill_name, b.bill_amount, b.bill_due_date, b.category, b.category_type, b.repeat_bill, b.payment_frequency, b.bill_repeat_date, b.paid FROM bills b INNER JOIN accounts a ON (b.account_id = a.account_id) WHERE a.household_id = $1;", 
        [1]);});

    // Tests error when a household has no bills
    it('should throw an Error when a household has no Bills', async () => {

      // ARRANGE -------------------------------------------------------------
      // Mocks empty database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT ---------------------------------------------------------
      // Expects Bill.getAllHouseholdBills() to throw error
      await expect(Bill.getAllHouseholdBills(999)).rejects.toThrow("Household currently has no bills.");
    });
  })

  // Test suite for Bill.getAllBankAccountBills() ---------------------------------------
  describe ('getAllBankAccountBills', () => {

    // Tests successful lookup for bills belonging to an account
    it('resolves with all bills belonging to a bank account on successful db query', async () => {

      // ARRANGE -----------------------------------------------------------
      // Fake Bill rows
      const testBills = [
        { account_id : 1, bill_id: 1, bill_name: "Netflix", bill_amount: 7, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false },
        { account_id : 1, bill_id: 2, bill_name: "Spotify", bill_amount: 12, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false}
      ]

      // Mocks database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testBills });

      // ACT ----------------------------------------------------------------
      // Runs Bill.getAllBankAccountBills()
      const result = await Bill.getAllBankAccountBills(1);

      // ASSERT -------------------------------------------------------------
      // Confirms the number of bill objects in outputs
      expect(result).toHaveLength(2);
      // Checks first object returned is a Bill instance
      expect(result[0]).toBeInstanceOf(Bill);
      // Checks second object returned is a Bill instance
      expect(result[1]).toBeInstanceOf(Bill);
      // Checks first bill's name
      expect(result[0].bill_name).toBe('Netflix');
      // Checks second bill's name
      expect(result[1].bill_name).toBe('Spotify');
      // Confirm's the first bill belongs to the expected account
      expect(result[0].account_id).toBe(1);
      // Confirm's the second bill belongs to the expected account
      expect(result[1].account_id).toBe(1);
      // Checks correct SQL query and parameter
      expect(db.query).toHaveBeenCalledWith("SELECT b.account_id, b.bill_id, b.bill_name, b.bill_amount, b.bill_due_date, b.category, b.category_type, b.repeat_bill, b.payment_frequency, b.bill_repeat_date, b.paid FROM bills b WHERE b.account_id = $1;", 
        [1]);
    });

    // Tests error when an account has no bills
    it('should throw an Error when a bank account has no Bills', async () => {

      // ARRANGE -------------------------------------------------------------
      // Mocks empty database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT ---------------------------------------------------------
      // Expects Bill.getAllBankAccountBills() to throw error
      await expect(Bill.getAllBankAccountBills(999)).rejects.toThrow("Bank account currently has no bills.");
    });
  })

  // Test suite for Bill.createBill() ---------------------------------------------
  describe('createBill', () => {

    // Tests successful bill creation
    it('resolves with bill on successful creation', async () => {

        // ARRANGE ----------------------------------------------------------------
        // Fake bill data from request body
        const mockCreateBill = { account_id: 1, bill_name: "Spotify", bill_amount: 12, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13" };
        // Fake inserted bill row returned from database
        const mockInsertedBill = { bill_id: 1, account_id: 1, bill_name: "Spotify", bill_amount: 12, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false };

        // Mocks first query: account exists
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ account_id: 1 }] });
        // Mocks second query: bill is inserted
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockInsertedBill] });

        // ACT ---------------------------------------------------------------------
        // Runs Bill.createBill()
        const result = await Bill.createBill(mockCreateBill);

        // ASSERT ------------------------------------------------------------------
        // Checks returned object is Bill instance
        expect(result).toBeInstanceOf(Bill);
        // Checks returned values
        expect(result).toHaveProperty('bill_name', 'Spotify');
        expect(result).toHaveProperty('category', 'Subscription');
        expect(result).toHaveProperty('payment_frequency', 'Monthly');
        expect(result).toHaveProperty('paid', false);
        // Checks account existence query and parameter
        expect(db.query).toHaveBeenNthCalledWith(1, "SELECT * FROM accounts WHERE account_id = $1", 
            [1]);
        // Checks correct INSERT query and parameters
        expect(db.query).toHaveBeenNthCalledWith(2, "INSERT INTO bills (account_id, bill_name, bill_amount, bill_due_date, category, category_type, repeat_bill, payment_frequency, bill_repeat_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;",
            [1, 'Spotify', 12, "2026-07-13", "Subscription", "Entertainment", true, "Monthly", "2026-08-13"]);
    });

    // Tests error when bank account does not exist
    it('should throw an Error when bank account does not exist', async () => {

        // ARRANGE ----------------------------------------------------------------
        // Fake bill data with an account_id that does not exist
        const mockCreateBill = { account_id: 999, bill_name: "Spotify", bill_amount: 12, category: "Subscription", repeat_bill: true, payment_frequency: "Monthly" };

        // Mocks database response where account is not found
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

        // ACT & ASSERT ------------------------------------------------------------
        // Expects Bill.createBill() to throw error
        await expect(Bill.createBill(mockCreateBill)).rejects.toThrow("Unable to create bill for account.");
    });
  });

  
  // Test suite for Bill.update() --------------------------------------------------------- 
  describe('updateBill', () => {

    // Tests successful bill update
    it('should return the updated bill on successful update', async () => {

      // ARRANGE ---------------------------------------------------------------------------
      // New update data
      const updateBillRequest = { bill_id: 1, bill_name: "Spotify Premium", bill_amount: 17, bill_due_date: "2026-07-13", bill_repeat_date: "2026-08-13" };
      // Expected updated row
      const updatedBill = { bill_id: 1, account_id: 1, bill_name: "Spotify Premium", bill_amount: 17, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false };

      // Mocks updated database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedBill] });

      // ACT -------------------------------------------------------------------------------
      // Runs bill.update()
      const result = await Bill.updateBill(updateBillRequest);

      // ASSERT ----------------------------------------------------------------------------
      // Checks returned object is Bill instance
      expect(result).toBeInstanceOf(Bill);
      // Checks updated values
      expect(result.bill_id).toBe(1);
      expect(result.bill_name).toBe('Spotify Premium');
      expect(result.bill_amount).toBe(17);
      // Checks correct UPDATE query and parameters
      expect(db.query).toHaveBeenCalledWith("UPDATE bills SET bill_name = $1, bill_amount = $2, bill_due_date = $3, bill_repeat_date = $4 WHERE bill_id = $5 RETURNING *;", 
        ["Spotify Premium", 17, "2026-07-13", "2026-08-13", 1]);
    });

    // Tests database failure during update
    it('should throw an Error if pre-existing bill does not exist', async () => {

      // ARRANGE -------------------------------------------------------------------------------
      const updateBillRequest = { bill_id: 1, bill_name: "Spotify Premium", bill_amount: 17, bill_due_date: "2026-07-13", bill_repeat_date: "2026-08-13" };

      // Mocks database failure
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT --------------------------------------------------------------------------
      // Expects update() to throw database error
      await expect(Bill.updateBill(updateBillRequest)).rejects.toThrow("Unable to update bill.");
    });
  })

    // Test suite for Bill.billPaid() --------------------------------------------------------- 
  describe('billPaid', () => {

    // Tests successful bill update
    it('should return an existing bill as paid on successful update', async () => {

      // ARRANGE ---------------------------------------------------------------------------
      // New update data
      const updateBillRequest = { bill_id: 1 }
      // Expected updated row
      const paidBillNotification = { paid: true };

      // Mocks updated database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [paidBillNotification] });

      // ACT -------------------------------------------------------------------------------
      // Runs bill.billPaid()
      const result = await Bill.billPaid(updateBillRequest);

      // ASSERT ----------------------------------------------------------------------------
      // Checks returned object is Bill instance
      expect(result).toEqual({ paid: true });
      // Checks JSON paid values
      expect(result.paid).toBe(true);
      // Checks correct UPDATE query and parameters
      expect(db.query).toHaveBeenCalledWith("UPDATE bills SET paid = true WHERE bill_id = $1 RETURNING paid;", 
        [1]);
    });

    // Tests database failure during update
    it('should throw an Error if pre-existing bill does not exist', async () => {

      // ARRANGE -------------------------------------------------------------------------------
      // New update data
      const updateBillRequest = { bill_id: 1}

      // Mocks database failure
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT --------------------------------------------------------------------------
      // Expects update() to throw database error
      await expect(Bill.billPaid(updateBillRequest)).rejects.toThrow("Unable to mark bill as paid.");
    });
  })

    // Test suite for Bill.deleteBill() -------------------------------------------------------------
    describe('deleteBill', () => {

    // Tests successful bill deletion
    it('should return the deleted bill on successful deletion', async () => {

        // ARRANGE -------------------------------------------------------------------------------
        // Bill to be deleted
        const deleteBillRequest = { bill_id: 1 };

        // Mock deleted database row
        const deletedBill = { bill_id: 1, account_id: 1, bill_name: "Spotify", bill_amount: 12, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false};

        // Mocks deleted database response
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [deletedBill] });

        // ACT -----------------------------------------------------------------------------------
        // Runs Bill.deleteBill()
        const result = await Bill.deleteBill(deleteBillRequest);

        // ASSERT --------------------------------------------------------------------------------
        // Checks returned object is Bill instance
        expect(result).toBeInstanceOf(Bill);

        // Checks deleted bill values
        expect(result.bill_id).toBe(1);
        expect(result.bill_name).toBe('Spotify');
        expect(result.bill_amount).toBe(12);

        // Checks correct DELETE query and parameter
        expect(db.query).toHaveBeenCalledWith("DELETE FROM bills WHERE bill_id = $1 RETURNING *;",
        [1]);
    });

    // Tests deletion of a bill that does not exist
    it('should throw an Error when bill does not exist', async () => {

        // ARRANGE -------------------------------------------------------------------------------
        // Bill to be deleted
        const deleteBillRequest = { bill_id: 999 };

        // Mocks empty database response
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

        // ACT & ASSERT --------------------------------------------------------------------------
        // Expects Bill.deleteBill() to throw error
        await expect(Bill.deleteBill(deleteBillRequest)).rejects.toThrow("Unable to delete bill.");
    });
  });
})