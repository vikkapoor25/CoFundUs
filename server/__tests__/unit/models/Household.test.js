// Import Household Model for testing
const Household = require('../../../models/Household')
// Import Database Connection for testing
const db = require('../../../database/connect')

// Main test suite for Household model ---------------------------------------
describe('Household', () => {

  beforeEach(() => {
  jest.restoreAllMocks()
})

afterAll(() => {
  jest.restoreAllMocks()
})


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

  // Test suite for Household.create() ---------------------------------------
  describe('create', () => {

    // Tests successful creation of a household account
    it('resolves with household on successful creation', async () => {
        
      // ARRANGE --------------------------------------------------------
      // Fake household data used for testing
      const mockHousehold = { household_username: 'Doe', household_password: 'password1', name_1: 'John', name_2: 'Alice', email_1: 'john@mail.com', email_2: 'alice@mail.com' };

      // Fake database row returned after Household.getOneById()
      const createdHousehold = { household_id: 1, household_username: 'Doe', household_password: 'password1', name_1: 'John', name_2: 'Alice', email_1: 'john@mail.com', email_2: 'alice@mail.com' };

      // Creates spy of db.query
      const querySpy = jest.spyOn(db, 'query');
      // First mock handles the INSERT query
      querySpy.mockResolvedValueOnce({ rows: [{ household_id: 1 }] });
      // Second mock handles the SELECT query inside Household.getOneById()
      querySpy.mockResolvedValueOnce({ rows: [createdHousehold] });

      // ACT ------------------------------------------------------------
      // Runs Household.create()
      const result = await Household.create(mockHousehold);

      // ASSERT --------------------------------------------------------
      // Checks a Household object was returned
      expect(result).toBeInstanceOf(Household);
      // Checks returned household has the correct household_id
      expect(result).toHaveProperty('household_id', 1);
      // Checks returned household has the correct household_username
      expect(result).toHaveProperty('household_username', 'Doe');
      // Checks returned household's password matches
      expect(result).toHaveProperty('household_password', 'password1');

      // Checks INSERT query was used with correct household data
      expect(querySpy).toHaveBeenNthCalledWith(1, "INSERT INTO household (household_username, household_password, name_1, name_2, email_1, email_2) VALUES ($1, $2, $3, $4, $5, $6) RETURNING household_id;", ['Doe', 'password1', 'John', 'Alice', 'john@mail.com', 'alice@mail.com']);
      
      // Checks SELECT query was used to retrieve the newly created household
      expect(querySpy).toHaveBeenNthCalledWith(2, "SELECT * FROM household WHERE household_id = $1", [1]);
    });
  })

  describe('saveTwoFactorCode', () => {
  it('resolves with updated household when 2FA code is saved', async () => {
    const expiresAt = new Date('2026-06-18T12:00:00.000Z')

    const mockHousehold = {
      household_id: 1,
      household_username: 'Doe',
      household_password: 'password1',
      name_1: 'John',
      name_2: 'Alice',
      email_1: 'john@mail.com',
      email_2: 'alice@mail.com',
      twofa_code: '123456',
      twofa_expires_at: expiresAt,
    }

    jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockHousehold] })

    const result = await Household.saveTwoFactorCode(1, '123456', expiresAt)

    expect(result).toBeInstanceOf(Household)
    expect(result.household_id).toBe(1)
    expect(result.twofa_code).toBe('123456')
    expect(result.twofa_expires_at).toEqual(expiresAt)
    expect(db.query).toHaveBeenCalledWith(
      `UPDATE household
            SET twofa_code = $1,
            twofa_expires_at = $2
            WHERE household_id = $3
            RETURNING *;`,
      ['123456', expiresAt, 1]
    )
  })

  it('throws an error when 2FA code cannot be saved', async () => {
    jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })

    await expect(
      Household.saveTwoFactorCode(1, '123456', new Date('2026-06-18T12:00:00.000Z'))
    ).rejects.toThrow('Unable to save 2FA code.')
  })
})

describe('verifyTwoFactorCode', () => {
  it('resolves with household when 2FA code is valid and not expired', async () => {
    const futureDate = new Date(Date.now() + 10 * 60 * 1000)

    const mockHousehold = {
      household_id: 1,
      household_username: 'Doe',
      household_password: 'password1',
      name_1: 'John',
      name_2: 'Alice',
      email_1: 'john@mail.com',
      email_2: 'alice@mail.com',
      twofa_code: '123456',
      twofa_expires_at: futureDate,
    }

    jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockHousehold] })

    const result = await Household.verifyTwoFactorCode(1, '123456')

    expect(result).toBeInstanceOf(Household)
    expect(result.household_id).toBe(1)
    expect(result.twofa_code).toBe('123456')
    expect(db.query).toHaveBeenCalledWith(
      `SELECT * FROM household
            WHERE household_id = $1
            AND twofa_code = $2;`,
      [1, '123456']
    )
  })

  it('throws an error when 2FA code is invalid', async () => {
    jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })

    await expect(
      Household.verifyTwoFactorCode(1, '000000')
    ).rejects.toThrow('Invalid 2FA code.')
  })

  it('throws an error when 2FA code has expired', async () => {
    const pastDate = new Date(Date.now() - 10 * 60 * 1000)

    const mockHousehold = {
      household_id: 1,
      household_username: 'Doe',
      household_password: 'password1',
      name_1: 'John',
      name_2: 'Alice',
      email_1: 'john@mail.com',
      email_2: 'alice@mail.com',
      twofa_code: '123456',
      twofa_expires_at: pastDate,
    }

    jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockHousehold] })

    await expect(
      Household.verifyTwoFactorCode(1, '123456')
    ).rejects.toThrow('2FA code has expired.')
  })
})

describe('clearTwoFactorCode', () => {
  it('resolves with household when 2FA code is cleared', async () => {
    const mockHousehold = {
      household_id: 1,
      household_username: 'Doe',
      household_password: 'password1',
      name_1: 'John',
      name_2: 'Alice',
      email_1: 'john@mail.com',
      email_2: 'alice@mail.com',
      twofa_code: null,
      twofa_expires_at: null,
    }

    jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockHousehold] })

    const result = await Household.clearTwoFactorCode(1)

    expect(result).toBeInstanceOf(Household)
    expect(result.household_id).toBe(1)
    expect(result.twofa_code).toBeNull()
    expect(result.twofa_expires_at).toBeNull()
    expect(db.query).toHaveBeenCalledWith(
      `UPDATE household
            SET twofa_code = NULL,
            twofa_expires_at = NULL
            WHERE household_id = $1
            RETURNING *;`,
      [1]
    )
  })

  it('throws an error when 2FA code cannot be cleared', async () => {
    jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })

    await expect(
      Household.clearTwoFactorCode(1)
    ).rejects.toThrow('Unable to clear 2FA code.')
  })
})

})