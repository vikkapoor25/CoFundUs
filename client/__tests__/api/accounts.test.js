import { getAccounts, createAccount, deleteAccount, getBalance } from '../../api/bank-accounts'

describe('api/bank-accounts', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ ok: true }) })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getAccounts requests the household accounts', async () => {
    await getAccounts(1)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toContain('/bank-accounts/1')
  })

  test('createAccount posts the account body', async () => {
    const body = { household_id: 1, account_name: 'Joint', account_balance: 100, account_type: 'shared' }
    await createAccount(body)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bank-accounts/new')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual(body)
  })

  test('deleteAccount deletes by account id', async () => {
    await deleteAccount(5)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/bank-accounts/delete')
    expect(options.method).toBe('DELETE')
    expect(JSON.parse(options.body)).toEqual({ account_id: 5 })
  })

  test('getBalance requests the balance endpoint', async () => {
    await getBalance(1)
    expect(fetch.mock.calls[0][0]).toContain('/bank-accounts/balance/1')
  })
})
