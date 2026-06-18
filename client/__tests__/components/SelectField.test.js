import { render, fireEvent, act } from '@testing-library/react-native'
import SelectField from '../../components/SelectField'

const OPTIONS = [
  { label: 'Salary', value: 'Salary' },
  { label: 'Refund', value: 'Refund' },
]

describe('SelectField', () => {
  test('shows the placeholder when nothing is selected', async () => {
    const { getByText } = await render(
      <SelectField label="Category" value="" onChange={() => {}} placeholder="Select Category" options={OPTIONS} />
    )
    expect(getByText('Select Category')).toBeTruthy()
  })

  test('shows the selected label when a value is set', async () => {
    const { getByText } = await render(
      <SelectField label="Category" value="Refund" onChange={() => {}} placeholder="Select Category" options={OPTIONS} />
    )
    expect(getByText('Refund')).toBeTruthy()
  })

  test('opens the dropdown and calls onChange when an option is picked', async () => {
    const onChange = jest.fn()
    const screen = await render(
      <SelectField label="Category" value="" onChange={onChange} placeholder="Select Category" options={OPTIONS} />
    )
    await act(async () => {
      fireEvent.press(screen.getByText('Select Category'))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Salary'))
    })
    expect(onChange).toHaveBeenCalledWith('Salary')
  })
})
