import { render, fireEvent, act } from '@testing-library/react-native'
import AccountCards from '../../components/AccountCards'

const ACCOUNTS = [
  {
    account_id: 7,
    account_name: 'Joint Current',
    account_type: 'Current',
    account_balance: 1200,
    net_gain_loss: 250,
    income_total: 2000,
    bills_total: 800,
    allocated_to_goal: 300,
  },
]

describe('AccountCards', () => {
  test('shows the empty message with no accounts', async () => {
    const { getByText } = await render(<AccountCards accounts={[]} />)
    expect(getByText(/don.t have any accounts/i)).toBeTruthy()
  })

  test('renders an account and fires the action callbacks', async () => {
    const addIncome = jest.fn()
    const deleteAccount = jest.fn()
    const screen = await render(
      <AccountCards accounts={ACCOUNTS} addIncome={addIncome} deleteAccount={deleteAccount} />
    )
    expect(screen.getByText('Joint Current')).toBeTruthy()
    expect(screen.getByText('Current')).toBeTruthy()

    await act(async () => {
      fireEvent.press(screen.getByText('Add Income'))
    })
    expect(addIncome).toHaveBeenCalledWith(7)

    await act(async () => {
      fireEvent.press(screen.getByText('Delete'))
    })
    expect(deleteAccount).toHaveBeenCalledWith(7)
  })
})
