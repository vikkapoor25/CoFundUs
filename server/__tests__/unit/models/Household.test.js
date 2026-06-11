// Import Household Model for testing
const Household = require('../../../models/Household')
// Import Database Connection for testing
const db = require('../../../database/connect')

// Main test suite for Household model ---------------------------------------
describe('Household', () => {

  // Runs before each test
  // Clears mock call history between tests
  beforeEach(() => jest.clearAllMocks())
  // Runs once after all tests finish
  // Resets mocked implementations
  afterAll(() => jest.resetAllMocks())


  // Test suite for Household.getOneById() ---------------------------------------
  describe ('getOneById', () => {

    // Tests successful retrieval of household account using household_id
    it('resolves with household account using the household_id on successful db query', async () => {

      // ARRANGE --------------------------------------------------------
      // Fake database row used for testing
      const mockHousehold = { household_id: 1, household_username: 'Doe', household_password: 'password1', name_1: 'John', name_2: 'Alice', email_1: 'john@mail.com', email_2: 'alice@mail.com' };

      // Mocks db.query() to return fake row once
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockHousehold] });

      // ACT ------------------------------------------------------------
      // Runs Household.getOneById()
      const household = await Household.getOneById(1);

      // ASSERT --------------------------------------------------------
      // Checks a Household object was returned
      expect(household).toBeInstanceOf(Household);
      // Checks returned household contains household_username
      expect(household).toHaveProperty('household_username');
      // Checks returned household's password matches
      expect(household.household_password).toBe('password1');
      // Checks correct SQL query was used with household_id
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM household WHERE household_id = $1', [1]);
    });


    // Tests error when no household is found
    it('should throw an Error when no household is found', async () => {

      // ARRANGE --------------------------------------------------------
      // Mocks empty database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT ---------------------------------------------------
      // Expects Household.getOneById() to throw error
      await expect(Household.getOneById(999)).rejects.toThrow('Unable to locate household.');
    });
  })
  
  // Test suite for Household.getOneByUsername() ---------------------------------------
  describe ('getOneByUsername', () => {

    // Tests successful retrieval of household account using household_username
    it('resolves with household account using the household_username on successful db query', async () => {

      // ARRANGE --------------------------------------------------------
      // Fake database row used for testing
      const mockHousehold = { household_id: 1, household_username: 'Doe', household_password: 'password1', name_1: 'John', name_2: 'Alice', email_1: 'john@mail.com', email_2: 'alice@mail.com' };

      // Mocks db.query() to return fake row once
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockHousehold] });

      // ACT ------------------------------------------------------------
      // Runs Household.getOneByUsername()
      const household = await Household.getOneByUsername('Doe');

      // ASSERT --------------------------------------------------------
      // Checks a Household object was returned
      expect(household).toBeInstanceOf(Household);
      // Checks returned household contains household_id
      expect(household).toHaveProperty('household_id');
      // Checks returned household contains username 'Doe'
      expect(household.household_username).toBe('Doe');
      // Checks returned household's password matches
      expect(household.household_password).toBe('password1');
      // Checks correct SQL query was used with household_username
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM household WHERE household_username = $1', ['Doe']);
    });


    // Tests error when no household is found
    it('should throw an Error when no household is found', async () => {

      // ARRANGE --------------------------------------------------------
      // Mocks empty database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT ---------------------------------------------------
      // Expects Household.getOneByUsername() to throw error
      await expect(Household.getOneByUsername('Chandler')).rejects.toThrow('Unable to locate household.');
    });
  })

})