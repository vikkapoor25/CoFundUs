const request = require('supertest')
const app = require('../../app')
const { resetTestDB } = require('./config')

describe('TARDIS API Endpoints', () => {
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

  describe('GET /', () => {
    it('responds to GET / with a message and a description', async () => {
      const response = await request(api).get('/')
  
      expect(response.statusCode).toBe(200)
      expect(response.body.title).toBe('TARDIS API')
      expect(response.body.description).toBe('Historical deduction game API')
    })
  });

  describe('GET /scenarios', () => {
    it('should return all scenario with a status code 200', async () => {
      const response = await request(api).get('/scenarios');

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  })


    describe('GET /explanations', () => {
    it('should return all explanations with a status code 200', async () => {
      const response = await request(api).get('/explanations');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);

    });
  });


  
})