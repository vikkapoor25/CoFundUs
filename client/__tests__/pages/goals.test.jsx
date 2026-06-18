import { render, act, fireEvent } from '@testing-library/react-native'
import Goals from '../../app/(tabs)/goals'

jest.mock('react-native-webview', () => ({ WebView: () => null }))
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn(), push: jest.fn() }) }))
jest.mock('../../api/goals', () => ({
  getGoals: jest.fn(() =>
    Promise.resolve([
      { goal_id: 1, goal_name: 'Holiday', goal_amount: 2000, current_value: 500, target_date: '2026-08-01' },
    ])
  ),
  createGoal: jest.fn(() => Promise.resolve({})),
  updateGoal: jest.fn(() => Promise.resolve({})),
  deleteGoal: jest.fn(() => Promise.resolve({ success: true })),
}))
jest.mock('../../api/goalInsights', () => ({
  getFeasibility: jest.fn(() =>
    Promise.resolve('Goal: Holiday\nFeasibility Rating: High\n\nGoal: Car\nFeasibility Rating: Low\n\nGoal: Phone\nFeasibility Rating: Medium\n\nGoal: House\nFeasibility Rating: Low')
  ),
  getPriority: jest.fn(() => Promise.resolve('Priority text')),
  getOptimisation: jest.fn(() => Promise.resolve('Optimisation text')),
}))

describe('Goals screen', () => {
  test('renders with goals and AI insights', async () => {
    let screen
    await act(async () => {
      screen = await render(<Goals />)
      await Promise.resolve()
    })
    expect(screen.toJSON()).toBeTruthy()
  })

  test('opens the Add Goal modal', async () => {
    let screen
    await act(async () => {
      screen = await render(<Goals />)
      await Promise.resolve()
    })
    await act(async () => {
      fireEvent.press(screen.getByText('+'))
    })
    expect(screen.getByText('Add Goal')).toBeTruthy()
  })
})
