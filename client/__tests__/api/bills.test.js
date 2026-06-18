import { getBills, createBill, deleteBill } from '../../api/bills'

describe('api/bills', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: true }) })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getBills requests the household bills', async () => {
    await getBills(1)
    expect(fetch.mock.calls[0][0]).toContain('/bills/household/1')
  })

  test('createBill posts the bill body', async () => {
    const body = { account_id: 1, bill_name: 'Netflix', bill_amount: 15 }
    await createBill(body)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bills/new')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual(body)
  })

  test('deleteBill deletes by bill id', async () => {
    await deleteBill(7)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bills/delete')
    expect(options.method).toBe('DELETE')
    expect(JSON.parse(options.body)).toEqual({ bill_id: 7 })
  })
})
