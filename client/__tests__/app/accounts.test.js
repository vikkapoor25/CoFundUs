import { render, act, fireEvent } from '@testing-library/react-native'
import Accounts from '../../app/(tabs)/accounts'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
jest.mock('@react-native-community/datetimepicker', () => ({ __esModule: true, default: () => null }))
jest.mock('../../api/bank-accounts', () => ({
  getAccounts: jest.fn(() =>
    Promise.resolve([
      { account_id: 7, account_name: 'Joint Current', account_type: 'Current', account_balance: 1200, net_gain_loss: 250 },
    ])
  ),
  getBalance: jest.fn(() => Promise.resolve({ total_balance: 1200 })),
  createAccount: jest.fn(() => Promise.resolve({})),
  deleteAccount: jest.fn(() => Promise.resolve({})),
  addIncome: jest.fn(() => Promise.resolve({})),
}))
jest.mock('../../api/income', () => ({
  createIncome: jest.fn(() => Promise.resolve({})),
}))
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: () => {},
}))

global.alert = jest.fn()

async function renderAccounts() {
  let screen
  await act(async () => {
    screen = await render(<Accounts />)
    await Promise.resolve()
  })
  return screen
}

describe('Accounts screen', () => {
  test('renders accounts loaded from the api', async () => {
    const screen = await renderAccounts()
    expect(screen.getByText('Joint Current')).toBeTruthy()
    expect(screen.getByText('Household Banks')).toBeTruthy()
  })

  test('creates a new account from the modal', async () => {
    const { createAccount } = require('../../api/bank-accounts')
    const screen = await renderAccounts()
    await act(async () => {
      fireEvent.press(screen.getByText('+'))
    })
    await act(async () => {
      fireEvent.changeText(screen.getByPlaceholderText('Enter your bank account name'), 'Savings')
      fireEvent.changeText(screen.getByPlaceholderText('Enter your balance'), '500')
      fireEvent.changeText(screen.getByPlaceholderText('Enter your bank type'), 'Savings')
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Add Account'))
    })
    expect(createAccount).toHaveBeenCalledWith(
      expect.objectContaining({ account_name: 'Savings', account_balance: '500', account_type: 'Savings' })
    )
  })

  test('opens the delete confirm modal and deletes the account', async () => {
    const { deleteAccount } = require('../../api/bank-accounts')
    const screen = await renderAccounts()
    await act(async () => {
      fireEvent.press(screen.getByText('Delete'))
    })
    // confirm modal now visible -> the modal's Delete is the last match
    await act(async () => {
      const deletes = screen.getAllByText('Delete')
      fireEvent.press(deletes[deletes.length - 1])
    })
    expect(deleteAccount).toHaveBeenCalledWith(7)
  })

  test('opens the income modal from a card', async () => {
    const screen = await renderAccounts()
    await act(async () => {
      fireEvent.press(screen.getByText('Add Income'))
    })
    expect(screen.getByText(/Adding income to/)).toBeTruthy()
  })
})
