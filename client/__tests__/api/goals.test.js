import { getGoals, createGoal, updateGoal, deleteGoal } from '../../api/goals'

describe('api/goals', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: true }) })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getGoals requests the household goals', async () => {
    await getGoals(1)
    expect(fetch.mock.calls[0][0]).toContain('/goals/household/1')
  })

  test('createGoal posts the goal body', async () => {
    const body = { household_id: 1, goal_name: 'Holiday', goal_amount: 2000, current_value: 0, target_date: '2026-08-01' }
    await createGoal(body)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/goals/new')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual(body)
  })

  test('updateGoal patches the goal body', async () => {
    const body = { goal_id: 1, goal_name: 'Holiday', goal_amount: 2000, current_value: 100, target_date: null }
    await updateGoal(body)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/goals/update')
    expect(options.method).toBe('PATCH')
    expect(JSON.parse(options.body)).toEqual(body)
  })

  test('deleteGoal deletes by goal id', async () => {
    await deleteGoal(3)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/goals/delete')
    expect(options.method).toBe('DELETE')
    expect(JSON.parse(options.body)).toEqual({ goal_id: 3 })
  })
})
