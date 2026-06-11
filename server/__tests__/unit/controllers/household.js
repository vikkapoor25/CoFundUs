// Import Household Model for testing
const Household = require('../../../models/Household')
// Import Household Controller for testing
const householdController = require('../../../controllers/household')

// Mocking response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

// We are mocking .send(), .json() and .end()
const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

// We are mocking .res()
const mockRes = { status: mockStatus };

// Main test suite for household controllers
describe('Household Controller', () => {
  
  // Runs before each test
  // Clears mock call history between tests
  beforeEach(() => jest.clearAllMocks())
  // Runs once after all tests finish
  // Resets mocked implementations
  afterAll(() => jest.resetAllMocks())

  // Test suite for register
  describe('register', () => {

      // Tests successful registration
      it('should create household with encrypted password and return status code 201', async () => {

          // ARRANGE --------------------------------------------------------
          const mockReq = { body: { household_username: 'Doe', household_password: 'password1', name_1: 'John', name_2: 'Alice', email_1: 'john@mail.com', email_2: 'alice@mail.com' } };
          const testRegister = { household_id: 1, household_username: 'Doe', household_password: 'hashedPassword', name_1: 'John', name_2: 'Alice', email_1: 'john@mail.com', email_2: 'alice@mail.com' };

          jest.spyOn(Household, 'create').mockResolvedValue(testRegister)

          // ACT ------------------------------------------------------------
          await householdController.register(mockReq, mockRes)
            
          // ASSERT ---------------------------------------------------------
          expect(Household.create).toHaveBeenCalledTimes(1)
          expect(mockStatus).toHaveBeenCalledWith(201)
          expect(mockSend).toHaveBeenCalledWith(testRegister)
      })

      // Tests unsuccessful registration
      it('should return an error upon unsuccessful registration with status code 400', async () => {

          // ARRANGE --------------------------------------------------------
          const mockReq = { body: { household_username: 'Doe', household_password: 'password1', name_1: 'John', name_2: 'Alice', email_1: 'john@mail.com', email_2: 'alice@mail.com' }};

          jest.spyOn(Household, 'create').mockRejectedValue(new Error('Unable to create household.'))
          // ACT ------------------------------------------------------------
          await householdController.register(mockReq, mockRes)
            
          // ASSERT ---------------------------------------------------------
          expect(Household.create).toHaveBeenCalledTimes(1)
          expect(mockStatus).toHaveBeenCalledWith(400)
          expect(mockJson).toHaveBeenCalledWith({ error: 'Unable to create household.' })
      })
  })



})