import { getHome, getBills, getNet, getGoal } from '../../api/home'

describe('api/home', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: true }) })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getHome requests the home summary', async () => {
    await getHome(1)
    expect(fetch.mock.calls[0][0]).toContain('/home/1')
  })

  test('getBills requests the home bills', async () => {
    await getBills(1)
    expect(fetch.mock.calls[0][0]).toContain('/home/bills/1')
  })

  test('getNet requests the net gain/loss', async () => {
    await getNet(1)
    expect(fetch.mock.calls[0][0]).toContain('/home/net/1')
  })

  test('getGoal requests the next goal', async () => {
    await getGoal(1)
    expect(fetch.mock.calls[0][0]).toContain('/home/goal/1')
  })
})
