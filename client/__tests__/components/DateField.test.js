import { render, fireEvent, act } from '@testing-library/react-native'
import DateField from '../../components/DateField'

jest.mock('@react-native-community/datetimepicker', () => {
  const { Pressable, Text } = require('react-native')
  return {
    __esModule: true,
    default: ({ onChange }) => (
      <Pressable testID="picker" onPress={() => onChange({ type: 'set' }, new Date('2026-01-15'))}>
        <Text>picker</Text>
      </Pressable>
    ),
  }
})

describe('DateField', () => {
  test('shows the empty prompt when no date is set', async () => {
    const { getByText } = await render(<DateField label="Due Date" value={null} onChange={() => {}} />)
    expect(getByText('Select a date')).toBeTruthy()
  })

  test('opens the picker and reports the chosen date', async () => {
    const onChange = jest.fn()
    const screen = await render(<DateField label="Due Date" value={null} onChange={onChange} />)
    await act(async () => {
      fireEvent.press(screen.getByText('Select a date'))
    })
    await act(async () => {
      fireEvent.press(screen.getByTestId('picker'))
    })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0] instanceof Date).toBe(true)
  })
})
