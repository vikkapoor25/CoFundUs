import { render, act } from '@testing-library/react-native'
import AddBill from '../../app/add-bill'
import AddGoal from '../../app/add-goal'
import AddIncome from '../../app/add-income'
import Logout from '../../app/(tabs)/logout'

const mockReplace = jest.fn()
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }) }))
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

describe('Placeholder add screens', () => {
  test('Add Bill screen renders', async () => {
    const { getByText } = await render(<AddBill />)
    expect(getByText('Add Bill Screen')).toBeTruthy()
  })

  test('Add Goal screen renders', async () => {
    const { getByText } = await render(<AddGoal />)
    expect(getByText('Add Goal Screen')).toBeTruthy()
  })

  test('Add Income screen renders', async () => {
    const { getByText } = await render(<AddIncome />)
    expect(getByText('Add Income Screen')).toBeTruthy()
  })
})

describe('Logout screen', () => {
  beforeEach(() => mockReplace.mockClear())

  test('clears the token and redirects to login', async () => {
    await act(async () => {
      await render(<Logout />)
      await new Promise((r) => setTimeout(r, 0))
    })
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login')
  })
})
