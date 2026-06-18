const request = require('supertest')
const app = require('../../app')
const { resetTestDB } = require('./config')

// Before Proceeding Ensure Table Structures are in Supabase

describe('Household API Endpoints', () => {
  let api

  beforeEach(async () => {
    await resetTestDB()
  })

  beforeAll(() => {
    api = app.listen(3000, () => {
      console.log('Test server running on port 3000')
    })
  })

  afterAll((done) => {
    console.log('Gracefully closing server')
    api.close(done)
  })

  describe('POST /user/register', () => {
    it('should create household with encrypted password and return status code 201', async () => {
        
        // ARRANGE
        const newHousehold = { household_username: 'Stark', household_password: 'RedWedding', name_1: 'Rob', name_2: 'Catalyn', email_1: 'rob@mail.com', email_2: 'catalyn@mail.com' };
        
        // ACT
        const response = await request(api).post('/user/register').send(newHousehold);

        // ASSERT
        expect(response.status).toBe(201)
        expect(response.body.household_username).toBe('Stark')
        expect(response.body.name_1).toBe('Rob')
        expect(response.body.name_2).toBe('Catalyn')
        expect(response.body.email_1).toBe('rob@mail.com')
        expect(response.body.email_2).toBe('catalyn@mail.com')
        expect(response.body.household_password).not.toBe('RedWedding') // Because it would be encrypted on successful registration
    });

    it('should return an error upon unsuccessful registration with status code 400', async () => {
        
        // ARRANGE
        // NOTE: This is only invalid if it has been created beforehand into the database
        const invalidHousehold = { household_username: 'test', household_password: 'test123', name_1: 'test1', name_2: 'test2', email_1: 'test1@mail.com', email_2: 'test2@mail.com' }

        // ACT
        const response = await request(api).post('/user/register').send(invalidHousehold);

        // ASSERT
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Unable to create household.' })
    });
});

describe('POST /user/login', () => {

    it('should return success, name_1, name_2 and jwt_token on successful login with status code 200', async () => {

        // ARRANGE
        const newHousehold = { household_username: 'Stark', household_password: 'RedWedding', name_1: 'Rob', name_2: 'Catalyn', email_1: 'rob@mail.com', email_2: 'catalyn@mail.com' };

        await request(api).post('/user/register').send(newHousehold);

        // ACT
        const response = await request(api).post('/user/login').send({ household_username: 'Stark', household_password: 'RedWedding' });

        // ASSERT
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.jwt_token).toEqual(expect.any(String));
        expect(response.body.name_1).toBe('Rob');
        expect(response.body.name_2).toBe('Catalyn');
    });

    it('should return an error upon unsuccessful login with status code 401', async () => {

        // ARRANGE
        const newHousehold = { household_username: 'Stark', household_password: 'RedWedding', name_1: 'Rob', name_2: 'Catalyn', email_1: 'rob@mail.com', email_2: 'catalyn@mail.com' };

        await request(api).post('/user/register').send(newHousehold);

        // ACT
        const response = await request(api).post('/user/login').send({ household_username: 'Stark', household_password: 'wrongPassword' });

        // ASSERT
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Household could not be authenticated' });
    });

});

describe('POST /user/verify-2fa', () => {
  it('should verify 2FA and return jwt token with status code 200', async () => {
    const newHousehold = {
      household_username: 'Stark',
      household_password: 'RedWedding',
      name_1: 'Rob',
      name_2: 'Catalyn',
      email_1: 'rob@mail.com',
      email_2: 'catalyn@mail.com'
    };

    await request(api).post('/user/register').send(newHousehold);

    const loginResponse = await request(api).post('/user/login').send({
      household_username: 'Stark',
      household_password: 'RedWedding'
    });

    const response = await request(api).post('/user/verify-2fa').send({
      household_id: loginResponse.body.household_id,
      code: loginResponse.body.demo_code
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.jwt_token).toEqual(expect.any(String));
    expect(response.body.household_id).toBe(loginResponse.body.household_id);
    expect(response.body.name_1).toBe('Rob');
    expect(response.body.name_2).toBe('Catalyn');
  });

  it('should return an error for invalid 2FA code with status code 401', async () => {
    const newHousehold = {
      household_username: 'Stark',
      household_password: 'RedWedding',
      name_1: 'Rob',
      name_2: 'Catalyn',
      email_1: 'rob@mail.com',
      email_2: 'catalyn@mail.com'
    };

    await request(api).post('/user/register').send(newHousehold);

    const loginResponse = await request(api).post('/user/login').send({
      household_username: 'Stark',
      household_password: 'RedWedding'
    });

    const response = await request(api).post('/user/verify-2fa').send({
      household_id: loginResponse.body.household_id,
      code: '000000'
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid 2FA code.' });
  });
});
  
})