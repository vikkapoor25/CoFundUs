import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import Card from '../../components/Card'

describe('Card', () => {
  test('renders its title and children', async () => {
    const { getByText } = await render(
      <Card title="My Card">
        <Text>Inside content</Text>
      </Card>
    )
    expect(getByText('My Card')).toBeTruthy()
    expect(getByText('Inside content')).toBeTruthy()
  })
})
