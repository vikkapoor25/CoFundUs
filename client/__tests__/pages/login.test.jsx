import { render, fireEvent } from '@testing-library/react-native'
import Login from '../../app/(auth)/login'

const mockReplace = jest.fn()
const mockPush = jest.fn()

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}))

describe('Login screen', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    mockPush.mockClear()
  })

  test('renders the heading and the inputs', async () => {
    const { getAllByText, getByPlaceholderText } = await render(<Login />)
    expect(getAllByText('Login').length).toBeGreaterThan(0)
    expect(getByPlaceholderText('Enter your email')).toBeTruthy()
    expect(getByPlaceholderText('Enter your password')).toBeTruthy()
  })

  test('lets the user type into the email and password fields', async () => {
    const { getByPlaceholderText } = await render(<Login />)
    const email = getByPlaceholderText('Enter your email')
    const password = getByPlaceholderText('Enter your password')

    await fireEvent.changeText(email, 'alex@test.com')
    await fireEvent.changeText(password, 'secret123')

    expect(email.props.value).toBe('alex@test.com')
    expect(password.props.value).toBe('secret123')
  })

  test('navigates home when the Login button is pressed', async () => {
    const { getAllByText } = await render(<Login />)
    await fireEvent.press(getAllByText('Login')[1])
    expect(mockReplace).toHaveBeenCalledWith('/')
  })

  test('navigates to register when Create account is pressed', async () => {
    const { getByText } = await render(<Login />)
    await fireEvent.press(getByText('Create account?'))
    expect(mockPush).toHaveBeenCalledWith('/register')
  })
})
