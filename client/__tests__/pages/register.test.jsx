import { render, fireEvent, waitFor } from '@testing-library/react-native'
import Register from '../../app/(auth)/register'
import { register as apiRegister } from '../../api/user'

const mockReplace = jest.fn()
const mockPush = jest.fn()

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}))
jest.mock('../../api/user', () => ({ login: jest.fn(), register: jest.fn() }))

describe('Register screen', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    mockPush.mockClear()
    apiRegister.mockReset()
  })

  test('renders the heading and the fields', async () => {
    const { getAllByText, getByPlaceholderText } = await render(<Register />)
    expect(getAllByText('Register').length).toBeGreaterThan(0)
    expect(getByPlaceholderText('choose a unique username')).toBeTruthy()
    expect(getByPlaceholderText('choose a password')).toBeTruthy()
  })

  test('submits the form to the register api', async () => {
    apiRegister.mockResolvedValue({})
    const { getAllByText, getByPlaceholderText } = await render(<Register />)
    await fireEvent.changeText(getByPlaceholderText('e.g. Alex'), 'Alex')
    await fireEvent.changeText(getByPlaceholderText('choose a unique username'), 'the-smiths')
    await fireEvent.changeText(getByPlaceholderText('choose a password'), 'secret123')
    await fireEvent.press(getAllByText('Register')[1])
    await waitFor(() => expect(apiRegister).toHaveBeenCalled())
  })

  test('shows a success message after registering', async () => {
    apiRegister.mockResolvedValue({})
    const { getAllByText, getByText, getByPlaceholderText } = await render(<Register />)
    await fireEvent.changeText(getByPlaceholderText('choose a unique username'), 'x')
    await fireEvent.changeText(getByPlaceholderText('choose a password'), 'y')
    await fireEvent.press(getAllByText('Register')[1])
    await waitFor(() => expect(getByText(/Registered successfully/)).toBeTruthy())
  })
})
