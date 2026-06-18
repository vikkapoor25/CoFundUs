import { getIncome, createIncome, deleteIncome } from '../../api/income'

describe('api/income', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: true }) })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getIncome requests the household income', async () => {
    await getIncome(1)
    expect(fetch.mock.calls[0][0]).toContain('/income/1')
  })

  test('createIncome posts the income body', async () => {
    const body = { income_amount: 3000, account_id: 1, category: 'Salary' }
    await createIncome(body)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/income/new')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual(body)
  })

  test('deleteIncome deletes by income id', async () => {
    await deleteIncome(2)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/income/delete')
    expect(options.method).toBe('DELETE')
    expect(JSON.parse(options.body)).toEqual({ income_id: 2 })
  })
})
