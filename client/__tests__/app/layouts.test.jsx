import { render, act } from '@testing-library/react-native'
import RootLayout from '../../app/_layout'
import TabsLayout from '../../app/(tabs)/_layout'

jest.mock('expo-router', () => {
  const React = require('react')
  const { View } = require('react-native')
  const Stack = ({ children }) => <View>{children}</View>
  Stack.Screen = () => null
  const Tabs = ({ children }) => <View>{children}</View>
  Tabs.Screen = () => null
  return {
    Stack,
    Tabs,
    useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
    useSegments: () => ['(tabs)'],
  }
})
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }))

describe('Layouts', () => {
  test('root layout renders after auth check', async () => {
    let screen
    await act(async () => {
      screen = await render(<RootLayout />)
      await new Promise((r) => setTimeout(r, 0))
    })
    expect(screen.toJSON()).toBeTruthy()
  })

  test('tabs layout renders', async () => {
    let screen
    await act(async () => {
      screen = await render(<TabsLayout />)
      await Promise.resolve()
    })
    expect(screen.toJSON()).toBeTruthy()
  })
})
