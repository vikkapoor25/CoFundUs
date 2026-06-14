// Imports Goal model being tested
const Goal = require('../../../models/Goal')
// Imports database connection module
const db = require('../../../database/connect')

// Main test suite for Goal model ---------------------------------------
describe('Goal', () => {

  // Runs before each test
  // Clears mock call history between tests
  beforeEach(() => jest.clearAllMocks())
  // Runs once after all tests finish
  // Resets mocked implementations
  afterAll(() => jest.resetAllMocks())

  // Test suite for Goal.getAllHouseholdGoals() ---------------------------------------
  describe ('getAllHouseholdGoals', () => {

    // Tests successful lookup for goals belonging to a household
    it('resolves with all goals belonging to a household on successful db query', async () => {

      // ARRANGE -----------------------------------------------------------
      // Fake Goal rows
      const testGoals = [
        { goal_id : 1, household_id : 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13"},
        { goal_id : 2, household_id : 1, goal_name: "Purchase PS5", goal_amount: 350, current_value: 100, target_date: "2026-07-13"}
      ]
      // Mocks database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testGoals });

      // ACT ----------------------------------------------------------------
      // Runs Goal.getAllHouseholdGoals()
      const result = await Goal.getAllHouseholdGoals(1);

      // ASSERT -------------------------------------------------------------
      // Confirms the number of goal objects in outputs
      expect(result).toHaveLength(2);
      // Checks first object returned is a Goal instance
      expect(result[0]).toBeInstanceOf(Goal);
      // Checks second object returned is a Goal instance
      expect(result[1]).toBeInstanceOf(Goal);
      // Checks first goal's name
      expect(result[0].goal_name).toBe('Purchase iPhone');
      // Checks second goal's name
      expect(result[1].goal_name).toBe('Purchase PS5');
      // Confirm's the first goal belongs to the expected househould
      expect(result[0].household_id).toBe(1);
      // Confirm's the second goal belongs to the expected househould
      expect(result[1].household_id).toBe(1);
      // Checks correct SQL query and parameter
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM goals WHERE household_id = $1;", 
        [1]);});

    // Tests error when a household has no goals
    it('should throw an Error when a household has no Goals', async () => {

      // ARRANGE -------------------------------------------------------------
      // Mocks empty database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT ---------------------------------------------------------
      // Expects Goal.getAllHouseholdGoals() to throw error
      await expect(Goal.getAllHouseholdGoals(999)).rejects.toThrow("Household currently has no financial goals.");
    });
  })

  // Test suite for Goal.createGoal() ---------------------------------------------
  describe('createGoal', () => {

    // Tests successful goal creation
    it('resolves with goal on successful creation', async () => {

        // ARRANGE ----------------------------------------------------------------
        // Fake goal data from request body
        const mockCreateGoal = { household_id: 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" };
        // Fake inserted goal row returned from database
        const mockInsertedGoal = { goal_id: 1, household_id: 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" };

        // Mocks first query: account exists
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ household_id : 1 }] });
        // Mocks second query: goal is inserted
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockInsertedGoal] });

        // ACT ---------------------------------------------------------------------
        // Runs Goal.createGoal()
        const result = await Goal.createGoal(mockCreateGoal);

        // ASSERT ------------------------------------------------------------------
        // Checks returned object is Goal instance
        expect(result).toBeInstanceOf(Goal);
        // Checks returned values
        expect(result).toHaveProperty('goal_name', 'Purchase iPhone');
        expect(result).toHaveProperty('goal_amount', 290);
        expect(result).toHaveProperty('target_date', '2026-07-13');
        // Checks account existence query and parameter
        expect(db.query).toHaveBeenNthCalledWith(1, "SELECT * FROM household WHERE household_id = $1", 
            [1]);
        // Checks correct INSERT query and parameters
        expect(db.query).toHaveBeenNthCalledWith(2, "INSERT INTO goals (household_id, goal_name, goal_amount, current_value, target_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
            [1, "Purchase iPhone", 290, 0, "2026-07-13"]);
    });

    // Tests error when household does not exist
    it('should throw an Error when household does not exist', async () => {

        // ARRANGE ----------------------------------------------------------------
        // Fake goal data where household_id doesn't exist
        const mockCreateGoal = { household_id: 999, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" };

        // Mocks database response where account is not found
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

        // ACT & ASSERT ------------------------------------------------------------
        // Expects Goal.createGoal() to throw error
        await expect(Goal.createGoal(mockCreateGoal)).rejects.toThrow("Unable to create goal for household.");
    });
  });

  
  // Test suite for Goal.update() --------------------------------------------------------- 
  describe('updateGoal', () => {

    // Tests successful goal update
    it('should return the updated goal on successful update', async () => {

      // ARRANGE ---------------------------------------------------------------------------
      // New update data
      const updateGoalRequest = { goal_id: 1, goal_name: "Purchase Android", goal_amount: 330, current_value: 0, target_date: "2026-07-13" };
      // Expected updated row
      const updatedGoal = { goal_id: 1, household_id: 1, goal_name: "Purchase Android", goal_amount: 330, current_value: 0, target_date: "2026-07-13" };

      // Mocks updated database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedGoal] });

      // ACT -------------------------------------------------------------------------------
      // Runs goal.updateGoal()
      const result = await Goal.updateGoal(updateGoalRequest);

      // ASSERT ----------------------------------------------------------------------------
      // Checks returned object is Goal instance
      expect(result).toBeInstanceOf(Goal);
      // Checks updated values
      expect(result.goal_id).toBe(1);
      expect(result.goal_name).toBe('Purchase Android');
      expect(result.goal_amount).toBe(330);
      // Checks correct UPDATE query and parameters
      expect(db.query).toHaveBeenCalledWith("UPDATE goals SET goal_name = $1, goal_amount = $2, current_value = $3, target_date = $4 WHERE goal_id = $5 RETURNING *;", 
        ["Purchase Android", 330, 0, "2026-07-13", 1]);
    });

    // Tests database failure during update
    it('should throw an Error if pre-existing goal does not exist', async () => {

      // ARRANGE -------------------------------------------------------------------------------
      // New update data
      const updateGoalRequest = { goal_id: 999, goal_name: "Purchase Android", goal_amount: 330, current_value: 0, target_date: "2026-07-13" };

      // Mocks database failure
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT --------------------------------------------------------------------------
      // Expects updateGoal() to throw database error
      await expect(Goal.updateGoal(updateGoalRequest)).rejects.toThrow("Unable to update goal.");
    });
  })

    // Test suite for Goal.deleteGoal() -------------------------------------------------------------
    describe('deleteGoal', () => {

    // Tests successful goal deletion
    it('should return the deleted goal on successful deletion', async () => {

        // ARRANGE -------------------------------------------------------------------------------
        // Goal to be deleted
        const deleteGoalRequest = { goal_id: 1 };

        // Mock deleted database row
        const deletedGoal = { goal_id: 1, household_id: 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" };

        // Mocks deleted database response
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [deletedGoal] });

        // ACT -----------------------------------------------------------------------------------
        // Runs Goal.deleteGoal()
        const result = await Goal.deleteGoal(deleteGoalRequest);

        // ASSERT --------------------------------------------------------------------------------
        // Checks returned object is Goal instance
        expect(result).toBeInstanceOf(Goal);

        // Checks deleted goal values
        expect(result.goal_id).toBe(1);
        expect(result.goal_name).toBe('Purchase iPhone');
        expect(result.goal_amount).toBe(290);

        // Checks correct DELETE query and parameter
        expect(db.query).toHaveBeenCalledWith("DELETE FROM goals WHERE goal_id = $1 RETURNING *;",
        [1]);
    });

    // Tests deletion of a goal that does not exist
    it('should throw an Error when goal does not exist', async () => {

        // ARRANGE -------------------------------------------------------------------------------
        // Goal to be deleted
        const deleteGoalRequest = { goal_id: 999 };

        // Mocks empty database response
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

        // ACT & ASSERT --------------------------------------------------------------------------
        // Expects Goal.deleteGoal() to throw error
        await expect(Goal.deleteGoal(deleteGoalRequest)).rejects.toThrow("Unable to delete goal.");
    });
  });
})