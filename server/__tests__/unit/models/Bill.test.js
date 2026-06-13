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
        { 
            household_id : 1, 
            account_id : 1, 
            bill_id: 1, 
            bill_name: "Netflix", 
            bill_amount: 7, 
            bill_due_date: "2026-07-13", 
            category: "Subscription", 
            category_type: "Entertainment", 
            repeat_bill: true, 
            payment_frequency: "Monthly", 
            bill_repeat_date: "2026-08-13", 
            paid: false
        },
        { 
            household_id : 1, 
            account_id : 2, 
            bill_id: 2, 
            bill_name: "Spotify", 
            bill_amount: 12, 
            bill_due_date: "2026-07-13", 
            category: "Subscription", 
            category_type: "Entertainment", 
            repeat_bill: true, 
            payment_frequency: "Monthly", 
            bill_repeat_date: "2026-08-13", 
            paid: false
        }
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
      expect(db.query).toHaveBeenCalledWith(`
            SELECT  a.household_id,
                    b.account_id,
                    b.bill_id,
                    b.bill_name,
                    b.bill_amount,
                    b.bill_due_date,
                    b.category,
                    b.category_type,
                    b.repeat_bill,
                    b.payment_frequency,
                    b.bill_repeat_date,
                    b.paid
            FROM bills b
            INNER JOIN accounts a
            ON (b.account_id = a.account_id)
            WHERE a.household_id = $1;`, [1]);    
    });

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


  // Test suite for Bill.create() ---------------------------------------------
  describe('create', () => {

    // Tests successful goat creation
    it('resolves with goat on successful creation', async () => {

      // ARRANGE ----------------------------------------------------------------
      // Fake goat data
      const goatData = { name: 'plum', age: 99 };
      // Mocks inserted database row
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ ...goatData, id: 1 }] });

      // ACT ---------------------------------------------------------------------
      // Runs Bill.create()
      const result = await Bill.create(goatData);

      // ASSERT ------------------------------------------------------------------
      // Checks returned object is Bill instance
      expect(result).toBeInstanceOf(Bill);
      // Checks returned values
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', 'plum');
      expect(result).toHaveProperty('age', 99);
      // Checks correct INSERT query and parameters
      expect(db.query).toHaveBeenCalledWith("INSERT INTO goats(name, age) VALUES ($1, $2) RETURNING *", [goatData.name, goatData.age]);
    });


    // Tests validation error when age missing
    it('should throw an Error when age is missing', async () => {

      // ARRANGE ------------------------------------------------------------------------
      // Missing age field
      const incompleteGoatData = { name: 'plum' };

      // ACT & ASSERT --------------------------------------------------------------------
      // Expects Bill.create() to throw validation error
      await expect(Bill.create(incompleteGoatData)).rejects.toThrow('age is missing');
    });
  })

  
  // Test suite for Bill.update() --------------------------------------------------------- 
  describe('update', () => {

    // Tests successful goat update
    it('should return the updated goat on successful update', async () => {

      // ARRANGE ---------------------------------------------------------------------------
      // Existing Bill instance
      const goat = new Bill({ id: 72, name: 'plum', age: 99 });
      // New update data
      const updatedData = { name: 'pear', age: 100 };
      // Expected updated row
      const updatedGoat = { id: 72, ...updatedData };
      // Mocks updated database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedGoat] });

      // ACT -------------------------------------------------------------------------------
      // Runs goat.update()
      const result = await goat.update(updatedData);

      // ASSERT ----------------------------------------------------------------------------
      // Checks returned object is Bill instance
      expect(result).toBeInstanceOf(Bill);
      // Checks updated values
      expect(result.id).toBe(72);
      expect(result.name).toBe('pear');
      expect(result.age).toBe(100);
      // Checks correct UPDATE query and parameters
      expect(db.query).toHaveBeenCalledWith("UPDATE goats SET name = $1, age = $2 WHERE id = $3 RETURNING * ",[updatedData.name, updatedData.age, goat.id]);
    });


    // Tests validation error when fields missing
    it('should throw an Error when age or name is missing', async () => {

      // ARRANGE -----------------------------------------------------------------------------
      // Existing Bill instance
      const goat = new Bill({ id: 1, name: 'plum', age: 99 });
      // Missing age field
      const incompleteData = { name: 'puppet' };

      // ACT & ASSERT --------------------------------------------------------------------------
      // Expects goat.update() to throw validation error
      await expect(goat.update(incompleteData)).rejects.toThrow('age or name missing');
    });


    // Tests database failure during update
    it('should throw an Error on db query failure', async () => {

      // ARRANGE -------------------------------------------------------------------------------
      // Existing Bill instance
      const goat = new Bill({ id: 72, name: 'plum', age: 99 });
      // Mocks database failure
      jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));

      // ACT & ASSERT --------------------------------------------------------------------------
      // Expects update() to throw database error
      await expect(goat.update({ name: 'pear', age: 100 })).rejects.toThrow('Database error');
    });
  })


  // Test suite for Bill.destroy() -------------------------------------------------------------
  describe ('destroy', () => {

    // Tests successful goat deletion
    it('should return the deleted goat on successful deletion', async () => {

      // ARRANGE -------------------------------------------------------------------------------
      // Existing Bill instance
      const goat = new Bill({ id: 72, name: 'plum', age: 72 });
      // Mocks deleted database row
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ id: 72, name: 'plum', age: 72 }] });

      // ACT -----------------------------------------------------------------------------------
      // Runs goat.destroy()
      const result = await goat.destroy();

      // ASSERT --------------------------------------------------------------------------------
      // Checks returned object is Bill instance
      expect(result).toBeInstanceOf(Bill);
      // Checks deleted goat values
      expect(result.id).toBe(72);
      expect(result.name).toBe('plum');
      expect(result.age).toBe(72);
      // Checks correct DELETE query and parameter
      expect(db.query).toHaveBeenCalledWith("DELETE FROM goats WHERE id = $1 RETURNING *", [goat.id]);
    });

    
    // Tests database failure during deletion
    it('should throw an Error on db query failure', async () => {

      // ARRANGE ---------------------------------------------------------------------------------
      // Existing Bill instance
      const goat = new Bill({ id: 72, name: 'plum', age: 72 });
      // Mocks database failure
      jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));

      // ACT & ASSERT -----------------------------------------------------------------------------
      // Expects destroy() to throw error
      await expect(goat.destroy()).rejects.toThrow('Cannot delete.');
    });
  })
})