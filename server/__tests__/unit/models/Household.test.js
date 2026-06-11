// Import Household Model for testing
const Household = require('../../../models/Household')
// Import Database Connection for testing
const db = require('../../../database/connect')

// Main test suite for Explanation model ---------------------------------------
xdescribe('Explanation', () => {

  // Runs before each test
  // Clears mock call history between tests
  beforeEach(() => jest.clearAllMocks())
  // Runs once after all tests finish
  // Resets mocked implementations
  afterAll(() => jest.resetAllMocks())


  // Test suite for Explanation.getAllExplanations() ---------------------------------------
  describe ('getAllExplanations', () => {

    // Tests successful retrieval of explanations
    it('resolves with explanations on successful db query', async () => {

      // ARRANGE --------------------------------------------------------
      // Fake database rows used for testing
      const mockExplanations = [
        { question_id: 1, answer: 'Fred', category: 1 , initial_setting: 'hello', explanation: 'yo'},
        { question_id: 2, answer: 'George', category: 1 , initial_setting: 'hello', explanation: 'yo'},
        { question_id: 3, answer: 'Ron', category: 1 , initial_setting: 'hello', explanation: 'yo'},

      ];
      // Mocks db.query() to return fake rows once
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockExplanations });

      // ACT ------------------------------------------------------------
      // Runs Explanation.getAllExplanations()
      const explanations = await Explanation.getAllExplanations();

      // ASSERT --------------------------------------------------------
      // Checks 3 explanations were returned
      expect(explanations).toHaveLength(3);
      // Checks first explanation contains question_id
      expect(explanations[0]).toHaveProperty('question_id');
      // Checks first explanation answer
      expect(explanations[0].answer).toBe('Fred');
      // Checks correct SQL query was used
      expect(db.query).toHaveBeenCalledWith('SELECT q.question_id, q.answer, s.category, s.initial_setting, q.explanation FROM questions q LEFT JOIN scenarios s ON (q.scenario_id = s.scenario_id)');
    });


    // Tests error when no explanations are found
    it('should throw an Error when no explanations are found', async () => {

      // ARRANGE --------------------------------------------------------
      // Mocks empty database response
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // ACT & ASSERT ---------------------------------------------------
      // Expects Explanation.getAllExplanations() to throw error
      await expect(Explanation.getAllExplanations()).rejects.toThrow('No explanation available.');
    });
  })
  
})
