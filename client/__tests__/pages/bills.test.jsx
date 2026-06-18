import { render, act, fireEvent } from '@testing-library/react-native'
import Bills from '../../app/(tabs)/bills'

jest.mock('react-native-webview', () => ({ WebView: () => null }))
jest.mock('@react-native-community/datetimepicker', () => ({ __esModule: true, default: () => null }))
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn(), push: jest.fn() }) }))
jest.mock('../../api/bills', () => ({
  getBills: jest.fn(() =>
    Promise.resolve([
      { bill_id: 1, account_id: 1, bill_name: 'Netflix', bill_amount: 15, bill_due_date: '2026-07-01', category: 'Luxury', category_type: 'Subscription', repeat_bill: true, paid: false },
      { bill_id: 2, account_id: 1, bill_name: 'Car Repair', bill_amount: 180, bill_due_date: '2026-07-10', category: 'Other', category_type: 'Negative', repeat_bill: false, paid: false },
    ])
  ),
  createBill: jest.fn(() => Promise.resolve({})),
  deleteBill: jest.fn(() => Promise.resolve({ success: true })),
  markBillPaid: jest.fn(() => Promise.resolve({ paid: true })),
  updateBill: jest.fn(() => Promise.resolve({})),
}))
jest.mock('../../api/bank-accounts', () => ({
  getAccounts: jest.fn(() => Promise.resolve([{ account_id: 1, account_name: 'Joint' }])),
}))

describe('Bills screen', () => {
  test('renders with bills from the api', async () => {
    let screen
    await act(async () => {
      screen = await render(<Bills />)
      await Promise.resolve()
    })
    expect(screen.toJSON()).toBeTruthy()
  })

  test('opens the Add Bill modal', async () => {
    let screen
    await act(async () => {
      screen = await render(<Bills />)
      await Promise.resolve()
    })
    await act(async () => {
      fireEvent.press(screen.getByText('+'))
    })
    expect(screen.getByText('Add Bill')).toBeTruthy()
  })

  test('marks a bill as paid', async () => {
    const { markBillPaid } = require('../../api/bills')
    let screen
    await act(async () => {
      screen = await render(<Bills />)
      await Promise.resolve()
    })
    await act(async () => {
      fireEvent.press(screen.getAllByText('Mark paid')[0])
    })
    expect(markBillPaid).toHaveBeenCalledWith(1)
  })

  test('deletes a bill', async () => {
    const { deleteBill } = require('../../api/bills')
    let screen
    await act(async () => {
      screen = await render(<Bills />)
      await Promise.resolve()
    })
    await act(async () => {
      fireEvent.press(screen.getAllByText('Delete')[0])
    })
    expect(deleteBill).toHaveBeenCalled()
  })
})
