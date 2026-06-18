import { render, fireEvent, waitFor } from '@testing-library/react-native'
import Login from '../../app/(auth)/login'
import { login as apiLogin } from '../../api/user'

const mockReplace = jest.fn()
const mockPush = jest.fn()

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}))
jest.mock('../../api/user', () => ({ login: jest.fn(), register: jest.fn() }))
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

describe('Login screen', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    mockPush.mockClear()
    apiLogin.mockReset()
  })

  test('renders the heading and the inputs', async () => {
    const { getAllByText, getByPlaceholderText } = await render(<Login />)
    expect(getAllByText('Login').length).toBeGreaterThan(0)
    expect(getByPlaceholderText('Enter your household username')).toBeTruthy()
    expect(getByPlaceholderText('Enter your password')).toBeTruthy()
  })

  test('lets the user type into the fields', async () => {
    const { getByPlaceholderText } = await render(<Login />)
    const username = getByPlaceholderText('Enter your household username')
    const password = getByPlaceholderText('Enter your password')
    await fireEvent.changeText(username, 'the-smiths')
    await fireEvent.changeText(password, 'secret123')
    expect(username.props.value).toBe('the-smiths')
    expect(password.props.value).toBe('secret123')
  })

  test('logs in and navigates home on success', async () => {
    apiLogin.mockResolvedValue({ jwt_token: 'tok', household_id: 1, name_1: 'A', name_2: 'B' })
    const { getAllByText, getByPlaceholderText } = await render(<Login />)
    await fireEvent.changeText(getByPlaceholderText('Enter your household username'), 'the-smiths')
    await fireEvent.changeText(getByPlaceholderText('Enter your password'), 'secret123')
    await fireEvent.press(getAllByText('Login')[1])
    await waitFor(() => expect(apiLogin).toHaveBeenCalledWith('the-smiths', 'secret123'))
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'))
  })

  test('shows an error when login fails', async () => {
    apiLogin.mockResolvedValue({ error: 'Invalid login details' })
    const { getAllByText, getByText, getByPlaceholderText } = await render(<Login />)
    await fireEvent.changeText(getByPlaceholderText('Enter your household username'), 'x')
    await fireEvent.changeText(getByPlaceholderText('Enter your password'), 'y')
    await fireEvent.press(getAllByText('Login')[1])
    await waitFor(() => expect(getByText('Invalid login details')).toBeTruthy())
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
