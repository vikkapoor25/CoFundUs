import { render, fireEvent } from '@testing-library/react-native'
import Register from '../../app/(auth)/register'

const mockReplace = jest.fn()
const mockPush = jest.fn()

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}))

describe('Register screen', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    mockPush.mockClear()
  })

  test('renders the heading and the inputs', async () => {
    const { getAllByText, getByPlaceholderText } = await render(<Register />)
    expect(getAllByText('Register').length).toBeGreaterThan(0)
    expect(getByPlaceholderText('Enter your email')).toBeTruthy()
    expect(getByPlaceholderText('Enter your password')).toBeTruthy()
  })

  test('lets the user type into the email and password fields', async () => {
    const { getByPlaceholderText } = await render(<Register />)
    const email = getByPlaceholderText('Enter your email')
    const password = getByPlaceholderText('Enter your password')

    await fireEvent.changeText(email, 'alex@test.com')
    await fireEvent.changeText(password, 'secret123')

    expect(email.props.value).toBe('alex@test.com')
    expect(password.props.value).toBe('secret123')
  })

  test('navigates to login when the Register button is pressed', async () => {
    const { getAllByText } = await render(<Register />)
    await fireEvent.press(getAllByText('Register')[1])
    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  test('navigates to login when Already have an account is pressed', async () => {
    const { getByText } = await render(<Register />)
    await fireEvent.press(getByText('Already have an account?'))
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})
