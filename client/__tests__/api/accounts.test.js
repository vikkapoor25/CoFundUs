import { addIncome, getAccounts, createAccount, deleteAccount, getBalance} from '../../api/bank-accounts'

describe('api/bank-accounts', () => {
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

  test('addIncome posts the income details', async () => {
    const body = {
      account_id: 1,
      income_amount: 500,
    }
    const data = await addIncome(body)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bank-accounts/?')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual(body)
    expect(data.success).toBe(true)
  })


  test('getAccounts fetches accounts for a household', async () => {
    const data = await getAccounts(1)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bank-accounts/1')
    expect(options).toBeUndefined()
    expect(data.success).toBe(true)
  })


  test('createAccount posts account details', async () => {
    const body = {
      household_id: 1,
      account_name: 'Savings',
      account_balance: 1000,
      account_type: 'Savings',
    }
    const data = await createAccount(body)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bank-accounts/new')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual(body)
    expect(data.success).toBe(true)
  })


  test('deleteAccount sends the account id', async () => {
    const data = await deleteAccount(5)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bank-accounts/delete')
    expect(options.method).toBe('DELETE')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({
      account_id: 5,
    })
    expect(data.success).toBe(true)
  })


  test('getBalance fetches the household balance', async () => {
    const data = await getBalance(1)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bank-accounts/balance/1')
    expect(options).toBeUndefined()
    expect(data.success).toBe(true)
  })
})