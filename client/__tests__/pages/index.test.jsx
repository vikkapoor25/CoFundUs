import { render, act } from '@testing-library/react-native'
import Home from '../../app/(tabs)/index'

jest.mock('react-native-webview', () => ({ WebView: () => null }))
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: () => {},
}))
jest.mock('../../api/home', () => ({
  getHome: jest.fn(() => Promise.resolve({})),
  getNet: jest.fn(() => Promise.resolve({ net_gain_loss: 2000 })),
  getBills: jest.fn(() =>
    Promise.resolve([
      { bill_name: 'Rent', bill_amount: 1500, account_name: 'Shared', bill_due_date: '2026-07-01' },
    ])
  ),
  getGoal: jest.fn(() =>
    Promise.resolve({ goal_name: 'Holiday', goal_amount: 2000, current_value: 500, target_date: '2026-08-01' })
  ),
}))

describe('Home screen', () => {
  test('renders without crashing', async () => {
    let screen
    await act(async () => {
      screen = await render(<Home />)
      await Promise.resolve()
    })
    expect(screen.toJSON()).toBeTruthy()
  })
})
