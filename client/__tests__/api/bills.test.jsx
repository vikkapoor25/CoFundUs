import { getBills, createBill, updateBill, markBillPaid, deleteBill} from '../../api/bills'

describe('api/bills', () => {
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

  test('getBills fetches bills for a household', async () => {
    const data = await getBills(1)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bills/household/1')
    expect(options).toBeUndefined()
    expect(data.success).toBe(true)
  })


  test('createBill posts the bill details', async () => {
    const body = {
      account_id: 1,
      bill_name: 'Netflix',
      bill_amount: 15,
      bill_due_date: '2026-06-18',
    }
    const data = await createBill(body)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bills/new')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual(body)
    expect(data.success).toBe(true)
  })


  test('updateBill patches the bill details', async () => {
    const body = {
      bill_id: 1,
      bill_name: 'Netflix',
      bill_amount: 20,
      bill_due_date: '2026-06-20',
      bill_repeat_date: '2026-07-20',
    }
    const data = await updateBill(body)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bills/update')
    expect(options.method).toBe('PATCH')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual(body)
    expect(data.success).toBe(true)
  })


  test('markBillPaid sends the bill id', async () => {
    const data = await markBillPaid(5)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bills/paid')
    expect(options.method).toBe('PATCH')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({
      bill_id: 5,
    })
    expect(data.success).toBe(true)
  })


  test('deleteBill sends the bill id', async () => {
    const data = await deleteBill(5)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bills/delete')
    expect(options.method).toBe('DELETE')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({
      bill_id: 5,
    })
    expect(data.success).toBe(true)
  })


  test('deleteBill returns success for a 204 response', async () => {
    fetch.mockResolvedValueOnce({
      status: 204,
    })
    const data = await deleteBill(5)
    expect(data).toEqual({
      success: true,
    })
  })
})