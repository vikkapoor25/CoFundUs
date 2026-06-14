const request = require('supertest')
const app = require('../../app')
const { resetTestDB } = require('./config')

// Before Proceeding Ensure Table Structures are in Supabase

describe('Bills API Endpoints', () => {
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

  describe('GET /bills/household/:household_id', () => {
    it('should return all bills belonging to a household with status code 200', async () => {
      const response = await request(api).get('/bills/household/1')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body[0].household_id).toBe(1)
      expect(response.body[0]).toHaveProperty('bill_name')
      expect(response.body[0]).toHaveProperty('bill_amount')
    })

    it('should return an error if household has no bills', async () => {
      const response = await request(api).get('/bills/household/999')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Household currently has no bills.' })
    })
  })

  describe('GET /bills/bank-account/:account_id', () => {
    it('should return all bills belonging to a bank account with status code 200', async () => {
      const response = await request(api).get('/bills/bank-account/1')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body[0].account_id).toBe(1)
      expect(response.body[0]).toHaveProperty('bill_name')
    })

    it('should return an error if bank account has no bills', async () => {
      const response = await request(api).get('/bills/bank-account/999')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Bank account currently has no bills.' })
    })
  })

  describe('POST /bills/new', () => {
    it('should create a new bill with status code 201', async () => {
      const newBill = { account_id: 1, bill_name: 'Netflix', bill_amount: 15, bill_due_date: '2026-07-01', category: 'Entertainment', category_type: 'Subscription', repeat_bill: true, payment_frequency: 'Monthly', bill_repeat_date: '2026-08-01' }

      const response = await request(api).post('/bills/new').send(newBill)

      expect(response.status).toBe(201)
      expect(response.body.bill_name).toBe('Netflix')
      expect(response.body.bill_amount).toBe(15)
      expect(response.body.category).toBe('Entertainment')
      expect(response.body.category_type).toBe('Subscription')
      expect(response.body.paid).toBe(false)
    })

    it('should return an error if account does not exist', async () => {
      const invalidBill = { account_id: 999, bill_name: 'Netflix', bill_amount: 15, category: 'Entertainment', repeat_bill: true, payment_frequency: 'Monthly' }

      const response = await request(api).post('/bills/new').send(invalidBill)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Unable to create bill for account.' })
    })
  })

  describe('PATCH /bills/update', () => {
    it('should update a bill with status code 200', async () => {
      const updateBill = { bill_id: 1, bill_name: 'Netflix Premium', bill_amount: 20, bill_due_date: '2026-07-15', bill_repeat_date: '2026-08-15' }

      const response = await request(api).patch('/bills/update').send(updateBill)

      expect(response.status).toBe(200)
      expect(response.body.bill_id).toBe(1)
      expect(response.body.bill_name).toBe('Netflix Premium')
      expect(response.body.bill_amount).toBe(20)
      expect(response.body.bill_due_date).toBe('2026-07-15')
    })

    it('should return an error if bill does not exist', async () => {
      const updateBill = { bill_id: 999, bill_name: 'Missing Bill', bill_amount: 20, bill_due_date: '2026-07-15', bill_repeat_date: '2026-08-15' }

      const response = await request(api).patch('/bills/update').send(updateBill)

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Unable to update bill.' })
    })
  })

  describe('PATCH /bills/paid', () => {
    it('should mark a bill as paid with status code 200', async () => {
      const response = await request(api).patch('/bills/paid').send({ bill_id: 1 })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ paid: true })
    })

    it('should return an error if bill does not exist', async () => {
      const response = await request(api).patch('/bills/paid').send({ bill_id: 999 })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Unable to mark bill as paid.' })
    })
  })

  describe('DELETE /bills/delete', () => {
    it('should delete a bill with status code 204', async () => {
      const response = await request(api).delete('/bills/delete').send({ bill_id: 1 })

      expect(response.status).toBe(204)
      expect(response.body).toEqual({})
    })

    it('should return an error if bill does not exist', async () => {
      const response = await request(api).delete('/bills/delete').send({ bill_id: 999 })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Unable to delete bill.' })
    })
  })
})