// Import Household Model for testing
const Household = require('../../../models/Household')
// Import Household Controller for testing
const householdController = require('../../../controllers/household')
// Importing bcrypt
const bcrypt = require('bcrypt')
// Importing JSON webtoken capabilities
const jwt = require('jsonwebtoken')

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

          jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('fakeSalt')
          jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword')
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

          jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('fakeSalt')
          jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword')
          jest.spyOn(Household, 'create').mockRejectedValue(new Error('Unable to create household.'))
          // ACT ------------------------------------------------------------
          await householdController.register(mockReq, mockRes)
            
          // ASSERT ---------------------------------------------------------
          expect(Household.create).toHaveBeenCalledTimes(1)
          expect(mockStatus).toHaveBeenCalledWith(400)
          expect(mockJson).toHaveBeenCalledWith({ error: "Unable to create household." })
      })
  })

    // Test suite for login
    describe('login', () => {

      // Tests successful login
      it('should return success, name_1, name_2 and jwt_token on successful login with status code 200', async () => {

          // ARRANGE --------------------------------------------------------
          const mockReq = { body: { household_username: 'Doe', household_password: 'password1' } };
          const mockHousehold = { household_id: 1, household_username: 'Doe', household_password: 'hashedPassword', name_1: 'John', name_2: 'Alice'
          };

          jest.spyOn(Household, 'getOneByUsername').mockResolvedValue(mockHousehold);
          jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
          jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => { callback(null, 'fakeJwtToken'); });

          // ACT ------------------------------------------------------------
          await householdController.login(mockReq, mockRes);
            
          // ASSERT ---------------------------------------------------------
          expect(Household.getOneByUsername).toHaveBeenCalledWith('Doe');
          expect(bcrypt.compare).toHaveBeenCalledWith('password1', 'hashedPassword');
          expect(jwt.sign).toHaveBeenCalledWith( { household_username: 'Doe' }, process.env.SECRET_TOKEN, { expiresIn: 3600 }, expect.any(Function));
          expect(mockStatus).toHaveBeenCalledWith(200);
          expect(mockJson).toHaveBeenCalledWith({ success: true, jwt_token: 'fakeJwtToken', name_1: 'John', name_2: 'Alice' });
      });


      // Tests unsuccessful login
      it('should return an error upon unsuccessful login with status code 401', async () => {

          // ARRANGE --------------------------------------------------------
          const mockReq = { body: { household_username: 'Doe', household_password: 'wrongPassword' } };
          const mockHousehold = { household_id: 1, household_username: 'Doe', household_password: 'hashedPassword', name_1: 'John', name_2: 'Alice' };

          jest.spyOn(Household, 'getOneByUsername').mockResolvedValue(mockHousehold);
          jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

          // ACT ------------------------------------------------------------
          await householdController.login(mockReq, mockRes);
            
          // ASSERT ---------------------------------------------------------
          expect(Household.getOneByUsername).toHaveBeenCalledWith('Doe');
          expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
          expect(mockStatus).toHaveBeenCalledWith(401);
          expect(mockJson).toHaveBeenCalledWith({ error: 'Household could not be authenticated' });
      });
    });

    describe('verifyTwoFactorLogin', () => {
  it('should verify 2FA, clear code, and return jwt token with status 200', async () => {
    const mockReq = { body: { household_id: 1, code: '123456' } };
    const mockHousehold = {
      household_id: 1,
      household_username: 'Doe',
      name_1: 'John',
      name_2: 'Alice'
    };

    jest.spyOn(Household, 'verifyTwoFactorCode').mockResolvedValue(mockHousehold);
    jest.spyOn(Household, 'clearTwoFactorCode').mockResolvedValue({
      ...mockHousehold,
      twofa_code: null,
      twofa_expires_at: null
    });
    jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
      callback(null, 'fakeJwtToken');
    });

    await householdController.verifyTwoFactorLogin(mockReq, mockRes);

    expect(Household.verifyTwoFactorCode).toHaveBeenCalledWith(1, '123456');
    expect(Household.clearTwoFactorCode).toHaveBeenCalledWith(1);
    expect(jwt.sign).toHaveBeenCalledWith(
      { household_username: 'Doe' },
      process.env.SECRET_TOKEN,
      { expiresIn: 3600 },
      expect.any(Function)
    );
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      success: true,
      jwt_token: 'fakeJwtToken',
      household_id: 1,
      name_1: 'John',
      name_2: 'Alice'
    });
  });

  it('should return error 401 when 2FA verification fails', async () => {
    const mockReq = { body: { household_id: 1, code: '000000' } };

    jest.spyOn(Household, 'verifyTwoFactorCode').mockRejectedValue(new Error('Invalid 2FA code.'));

    await householdController.verifyTwoFactorLogin(mockReq, mockRes);

    expect(Household.verifyTwoFactorCode).toHaveBeenCalledWith(1, '000000');
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid 2FA code.' });
  });
});
})