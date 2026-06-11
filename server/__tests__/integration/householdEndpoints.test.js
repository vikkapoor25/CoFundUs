const request = require('supertest')
const app = require('../../app')
const { resetTestDB } = require('./config')

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




  
})