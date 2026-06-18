import { login, register, verify } from '../../api/user'

describe('api/user', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ jwt_token: 'fake-token' }) })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('login posts the credentials to /user/login', async () => {
    const data = await login('the-smiths', 'secret123')

    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/user/login')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({
      household_username: 'the-smiths',
      household_password: 'secret123',
    })
    expect(data.jwt_token).toBe('fake-token')
  })

  test('register posts the details to /user/register', async () => {
    const details = { household_username: 'the-smiths', household_password: 'secret123' }
    const data = await register(details)

    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/user/register')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual(details)
    expect(data.jwt_token).toBe('fake-token')
  })
  
  test('verify posts the 2FA code to /user/verify-2fa', async () => {
    const data = await verify(1, '123456')

    expect(fetch).toHaveBeenCalledTimes(1)

    const [url, options] = fetch.mock.calls[0]

    expect(url).toContain('/user/verify-2fa')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({
      household_id: 1,
      code: '123456',
    })

    expect(data.jwt_token).toBe('fake-token')
  })
})
