import { getIncome, createIncome, deleteIncome} from '../../api/income'


describe('api/income', () =>{
    beforeEach(() => {
        global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ success: true }),
        })
        )
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    test('getincome fetches income for household', async () => {
      const data = await getIncome(1)
      expect(fetch).toHaveBeenCalledTimes(1)
      const [url, options] = fetch.mock.calls[0]
      expect(url).toContain('/income/1')
      expect(options).toBeUndefined()
      expect(data.success).toBe(true)
    })


    test('createIncome creates new income for household', async () => {
        const body = {
            account_id: 1,
            income_name: "Bonus",
            income_amount: 500,
            payment_date: '2026-06-18',
            category: "Payment",
            payment_frequency: "Monthly",
            }
        const data = await createIncome(body)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/income/new')
        expect(options.method).toBe('POST')
        expect(options.headers['Content-Type']).toBe('application/json')
        expect(JSON.parse(options.body)).toEqual(body)
        expect(data.success).toBe(true)
    })


    test('deleteIncome sends the income id', async () => {
        const data = await deleteIncome(5)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/income/delete')
        expect(options.method).toBe('DELETE')
        expect(options.headers['Content-Type']).toBe('application/json')
        expect(JSON.parse(options.body)).toEqual({
          income_id: 5,
        })
        expect(data.success).toBe(true)
      })


})