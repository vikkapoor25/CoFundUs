import { render, fireEvent } from '@testing-library/react-native'
import AddButton from '../../components/AddButton'

describe('AddButton', () => {
  test('renders a + symbol', async () => {
    const { getByText } = await render(<AddButton onPress={() => {}} />)
    expect(getByText('+')).toBeTruthy()
  })

  test('calls onPress when pressed', async () => {
    const onPress = jest.fn()
    const { getByText } = await render(<AddButton onPress={onPress} />)
    await fireEvent.press(getByText('+'))
    expect(onPress).toHaveBeenCalled()
  })
})
