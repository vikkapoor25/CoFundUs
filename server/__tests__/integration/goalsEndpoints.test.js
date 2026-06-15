const request = require('supertest')
const app = require('../../app')
const { resetTestDB } = require('./config')

// Before Proceeding Ensure Table Structures are in Supabase

describe('Goals API Endpoints', () => {
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


  describe('GET /goals/household/:household_id', () => {
    it('should return all goals belonging to a household with status code 200', async () => {
      const response = await request(api).get('/goals/household/1')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body[0].household_id).toBe(1)
      expect(response.body[0]).toHaveProperty('goal_name')
      expect(response.body[0]).toHaveProperty('goal_amount')
    })

    it('should return an error if household has no goals', async () => {
      const response = await request(api).get('/goals/household/999')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Household currently has no financial goals.' })
    })
  })


  describe('POST /goals/new', () => {
    it('should create a new goal with status code 201', async () => {
      const newGoal = { household_id: 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" }

      const response = await request(api).post('/goals/new').send(newGoal)

      expect(response.status).toBe(201)
      expect(response.body.goal_name).toBe('Purchase iPhone')
      expect(response.body.goal_amount).toBe(290)
      expect(response.body.current_value).toBe(0)
      expect(response.body.target_date).toBe("2026-07-13")
    })

    it('should return an error if household does not exist', async () => {
      const invalidGoal = { household_id: 999, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" }

      const response = await request(api).post('/goals/new').send(invalidGoal)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Unable to create goal for household.' })
    })
  })


  describe('PATCH /goals/update', () => {
    it('should update a goal with status code 200', async () => {
      const updateGoal = { goal_id: 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" }

      const response = await request(api).patch('/goals/update').send(updateGoal)

      expect(response.status).toBe(200)
      expect(response.body.goal_id).toBe(1)
      expect(response.body.goal_name).toBe('Purchase iPhone')
      expect(response.body.goal_amount).toBe(290)
      expect(response.body.target_date).toBe('2026-07-13')
    })

    it('should return an error if goal does not exist', async () => {
      const updateGoal = { goal_id: 999, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" }

      const response = await request(api).patch('/goals/update').send(updateGoal)

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Unable to update goal.' })
    })
  })


  describe('DELETE /goals/delete', () => {
    it('should delete a goal with status code 204', async () => {
      const response = await request(api).delete('/goals/delete').send({ goal_id: 1 })

      expect(response.status).toBe(204)
      expect(response.body).toEqual({})
    })

    it('should return an error if goal does not exist', async () => {
      const response = await request(api).delete('/goals/delete').send({ goal_id: 999 })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Unable to delete goal.' })
    })
  })

})