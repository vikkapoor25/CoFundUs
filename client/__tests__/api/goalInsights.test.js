import { getFeasibility, getPriority, getOptimisation } from '../../api/goalInsights'

describe('api/goalInsights', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve('insight text') })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getFeasibility requests the feasibility insight', async () => {
    await getFeasibility(1)
    expect(fetch.mock.calls[0][0]).toContain('/goal-insights/feasibility/household/1')
  })

  test('getPriority requests the priority insight', async () => {
    await getPriority(1)
    expect(fetch.mock.calls[0][0]).toContain('/goal-insights/priority/household/1')
  })

  test('getOptimisation requests the optimisation insight', async () => {
    await getOptimisation(1)
    expect(fetch.mock.calls[0][0]).toContain('/goal-insights/optimisation/household/1')
  })
})
