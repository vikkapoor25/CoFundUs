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
      // Fake database rows used for testing
      const mockHousehold = [
        { household_id: 1, household_username: 'Doe', household_password: 'password1', name_1: 'John', name_2: 'Alice', email_1: 'john@mail.com', email_2: 'alice@mail.com'},
        { household_id: 2, household_username: 'Snow', household_password: 'asoiafgrrm', name_1: 'John', name_2: 'Ygritte', email_1: 'john.snow@mail.com', email_2: 'ygritte@mail.com'},
        { household_id: 3, household_username: 'Bing', household_password: 'friends', name_1: 'Chandler', name_2: 'Monica', email_1: 'chandler@mail.com', email_2: 'monica@mail.com'}

      ];
      // Mocks db.query() to return fake rows once
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockHousehold });

      // ACT ------------------------------------------------------------
      // Runs Household.getOneById()
      const household = await Household.getOneById(1);

      // ASSERT --------------------------------------------------------
      // Checks 1 household was returned
      expect(household).toHaveLength(1);
      // Checks second household contains household_username
      expect(household[1]).toHaveProperty('household_username');
      // Checks second household's password matches
      expect(household[1].household_password).toBe('asoiafgrrm');
      // Checks correct SQL query was used
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM household WHERE household_id = 2');
    });


    // Tests error when no household is found
    it('should throw an Error when no household is found', async () => {

      // ARRANGE --------------------------------------------------------
      // Mocks empty database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT ---------------------------------------------------
      // Expects Explanation.getAllExplanations() to throw error
      await expect(Household.getOneById()).rejects.toThrow('Unable to locate household.');
    });
  })
  
})
